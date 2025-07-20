import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";

export async function getRecommendedUsers(req, res) {
    try {
        const currentUserId = req.user.id;
        const currentUser = await User.findById(req.user.id).select("friends");

        console.log("User ID:", currentUserId);
        console.log("Friends:", currentUser.friends);

        const recommendedUsers = await User.find({
            $and: [
                { _id: { $ne: currentUserId } }, //exclude current user
                { _id: { $nin: currentUser.friends } }, // exclude current user's friends
                { isOnboarded: true },
            ],
        });
        console.log("Recommended:", recommendedUsers.length);

        res.status(200).json(recommendedUsers);
    } catch (error) {
        console.error("Error in getRecommendedUsers controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getMyFriends(req, res) {
    try {
        const user = await User.findById(req.user.id)
            .select("friends")
            .populate("friends", "fullName profilePic avatarConfig nativeLanguage learningLanguage email");

        res.status(200).json(user.friends);
    } catch (error) {
        console.error("Error in getMyFriends controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function sendFriendRequest(req, res) {
    try {
        const myId = req.user.id;
        const { id: recipientId } = req.params;

        // prevent sending req to yourself
        if (myId === recipientId) {
            return res.status(400).json({ message: "You can't send friend request to yourself" });
        }

        const recipient = await User.findById(recipientId);
        if (!recipient) {
            return res.status(404).json({ message: "Recipient not found" });
        }

        // check if user is already friends
        if (recipient.friends.includes(myId)) {
            return res.status(400).json({ message: "You are already friends with this user" });
        }

        // check if a req already exists
        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: myId, recipient: recipientId },
                { sender: recipientId, recipient: myId },
            ],
        });

        if (existingRequest) {
            return res
                .status(400)
                .json({ message: "A friend request already exists between you and this user" });
        }

        const friendRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId,
        });

        res.status(201).json(friendRequest);
    } catch (error) {
        console.error("Error in sendFriendRequest controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function acceptFriendRequest(req, res) {
    try {
        const { id: requestId } = req.params;

        const friendRequest = await FriendRequest.findById(requestId);

        if (!friendRequest) {
            return res.status(404).json({ message: "Friend request not found" });
        }

        // Verify the current user is the recipient
        if (friendRequest.recipient.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to accept this request" });
        }

        friendRequest.status = "accepted";
        await friendRequest.save();

        // add each user to the other's friends array
        // $addToSet: adds elements to an array only if they do not already exist.
        await User.findByIdAndUpdate(friendRequest.sender, {
            $addToSet: { friends: friendRequest.recipient },
        });

        await User.findByIdAndUpdate(friendRequest.recipient, {
            $addToSet: { friends: friendRequest.sender },
        });

        res.status(200).json({ message: "Friend request accepted" });
    } catch (error) {
        console.log("Error in acceptFriendRequest controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getFriendRequests(req, res) {
    try {
        const incomingReqs = await FriendRequest.find({
            recipient: req.user.id,
            status: "pending",
        }).populate("sender", "fullName profilePic avatarConfig nativeLanguage learningLanguage email");

        const acceptedReqs = await FriendRequest.find({
            sender: req.user.id,
            status: "accepted",
        }).populate("recipient", "fullName profilePic avatarConfig email");

        res.status(200).json({ incomingReqs, acceptedReqs });
    } catch (error) {
        console.log("Error in getPendingFriendRequests controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getOutgoingFriendReqs(req, res) {
    try {
        const outgoingRequests = await FriendRequest.find({
            sender: req.user.id,
            status: "pending",
        }).populate("recipient", "fullName profilePic avatarConfig nativeLanguage learningLanguage email");

        res.status(200).json(outgoingRequests);
    } catch (error) {
        console.log("Error in getOutgoingFriendReqs controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getCoLearners(req, res) {
    try {
        const currentUserId = req.user.id;
        const currentUser = await User.findById(currentUserId).select("friends learningLanguage");

        if (!currentUser.learningLanguage) {
            return res.status(400).json({ message: "User has not set a learning language" });
        }

        // Get users who have pending friend requests from current user (outgoing)
        const outgoingRequests = await FriendRequest.find({
            sender: currentUserId,
            status: "pending"
        }).select("recipient");

        // Get users who have sent pending friend requests to current user (incoming)
        const incomingRequests = await FriendRequest.find({
            recipient: currentUserId,
            status: "pending"
        }).select("sender");

        const usersWithOutgoingRequests = outgoingRequests.map(req => req.recipient);
        const usersWithIncomingRequests = incomingRequests.map(req => req.sender);
        const allUsersToExclude = [...usersWithOutgoingRequests, ...usersWithIncomingRequests];

        const coLearners = await User.find({
            $and: [
                { _id: { $ne: currentUserId } }, // exclude current user
                { _id: { $nin: currentUser.friends } }, // exclude current user's friends
                { _id: { $nin: allUsersToExclude } }, // exclude users with pending requests (both outgoing and incoming)
                { isOnboarded: true },
                { learningLanguage: { $regex: new RegExp(`^${currentUser.learningLanguage}$`, 'i') } }, // case-insensitive match
            ],
        }).select("fullName profilePic avatarConfig nativeLanguage learningLanguage email location bio");

        res.status(200).json(coLearners);
    } catch (error) {
        console.error("Error in getCoLearners controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getNativeSpeakers(req, res) {
    try {
        const currentUserId = req.user.id;
        const currentUser = await User.findById(currentUserId).select("friends nativeLanguage");

        if (!currentUser.nativeLanguage) {
            return res.status(400).json({ message: "User has not set a native language" });
        }

        // Get users who have pending friend requests from current user (outgoing)
        const outgoingRequests = await FriendRequest.find({
            sender: currentUserId,
            status: "pending"
        }).select("recipient");

        // Get users who have sent pending friend requests to current user (incoming)
        const incomingRequests = await FriendRequest.find({
            recipient: currentUserId,
            status: "pending"
        }).select("sender");

        const usersWithOutgoingRequests = outgoingRequests.map(req => req.recipient);
        const usersWithIncomingRequests = incomingRequests.map(req => req.sender);
        const allUsersToExclude = [...usersWithOutgoingRequests, ...usersWithIncomingRequests];

        const nativeSpeakers = await User.find({
            $and: [
                { _id: { $ne: currentUserId } }, // exclude current user
                { _id: { $nin: currentUser.friends } }, // exclude current user's friends
                { _id: { $nin: allUsersToExclude } }, // exclude users with pending requests (both outgoing and incoming)
                { isOnboarded: true },
                { nativeLanguage: { $regex: new RegExp(`^${currentUser.nativeLanguage}$`, 'i') } }, // case-insensitive match
            ],
        }).select("fullName profilePic avatarConfig nativeLanguage learningLanguage email location bio");

        res.status(200).json(nativeSpeakers);
    } catch (error) {
        console.error("Error in getNativeSpeakers controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getLanguageTeachers(req, res) {
    try {
        const currentUserId = req.user.id;
        const currentUser = await User.findById(currentUserId).select("friends learningLanguage");

        if (!currentUser.learningLanguage) {
            return res.status(400).json({ message: "User has not set a learning language" });
        }

        // Get users who have pending friend requests from current user (outgoing)
        const outgoingRequests = await FriendRequest.find({
            sender: currentUserId,
            status: "pending"
        }).select("recipient");

        // Get users who have sent pending friend requests to current user (incoming)
        const incomingRequests = await FriendRequest.find({
            recipient: currentUserId,
            status: "pending"
        }).select("sender");

        const usersWithOutgoingRequests = outgoingRequests.map(req => req.recipient);
        const usersWithIncomingRequests = incomingRequests.map(req => req.sender);
        const allUsersToExclude = [...usersWithOutgoingRequests, ...usersWithIncomingRequests];

        const languageTeachers = await User.find({
            $and: [
                { _id: { $ne: currentUserId } }, // exclude current user
                { _id: { $nin: currentUser.friends } }, // exclude current user's friends
                { _id: { $nin: allUsersToExclude } }, // exclude users with pending requests (both outgoing and incoming)
                { isOnboarded: true },
                { nativeLanguage: { $regex: new RegExp(`^${currentUser.learningLanguage}$`, 'i') } }, // native speakers of user's learning language
            ],
        }).select("fullName profilePic avatarConfig nativeLanguage learningLanguage email location bio");
        res.status(200).json(languageTeachers);
    } catch (error) {
        console.error("Error in getLanguageTeachers controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function searchUsers(req, res) {
    try {
        const currentUserId = req.user.id;
        const { q: query } = req.query;

        if (!query || query.trim().length === 0) {
            return res.status(400).json({ message: "Search query is required" });
        }

        // Search all users (including friends) but exclude current user
        const searchResults = await User.find({
            $and: [
                { _id: { $ne: currentUserId } }, // exclude current user
                { isOnboarded: true },
                {
                    $or: [
                        { fullName: { $regex: query, $options: 'i' } }, // case-insensitive search
                        { email: { $regex: query, $options: 'i' } },
                    ]
                }
            ],
        }).select("fullName profilePic avatarConfig nativeLanguage learningLanguage email location bio");

        res.status(200).json(searchResults);
    } catch (error) {
        console.error("Error in searchUsers controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}