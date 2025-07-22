import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SearchIcon, UserIcon, UserPlusIcon, CheckCircleIcon } from "lucide-react";
import { searchUsers, sendFriendRequest, getOutgoingFriendReqs, getUserFriends } from "../lib/api";
import { getUserAvatar } from "../utils/avatar";
import { getLanguageFlag } from "./FriendCard";
import toast from "react-hot-toast";

const UserSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());
  const searchRef = useRef(null);
  const queryClient = useQueryClient();

  const { data: searchResults = [], isLoading } = useQuery({
    queryKey: ["searchUsers", searchQuery],
    queryFn: () => searchUsers(searchQuery),
    enabled: searchQuery.length >= 2, // Only search when query is at least 2 characters
    staleTime: 30000, // Cache results for 30 seconds
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { data: friends = [] } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { mutate: sendFriendRequestMutation, isPending: sendingRequest } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: (_, userId) => {
      toast.success("Friend request sent!");
      setOutgoingRequestsIds(prev => new Set([...prev, userId]));
      // Invalidate outgoing friend requests
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] });
      // Invalidate all user lists to remove the user who just received a request
      queryClient.invalidateQueries({ queryKey: ["coLearners"] });
      queryClient.invalidateQueries({ queryKey: ["nativeSpeakers"] });
      queryClient.invalidateQueries({ queryKey: ["languageTeachers"] });
      // Note: We don't invalidate searchUsers since we want to show the updated status
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to send friend request");
    },
  });

  // Update outgoing requests when data changes
  useEffect(() => {
    if (outgoingFriendReqs) {
      const requestIds = new Set(outgoingFriendReqs.map(req => req.recipient._id));
      setOutgoingRequestsIds(requestIds);
    }
  }, [outgoingFriendReqs]);

  // Create a set of friend IDs for quick lookup
  const friendIds = new Set(friends.map(friend => friend._id));

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setIsOpen(value.length >= 2);
  };

  const handleUserClick = () => {
    setSearchQuery("");
    setIsOpen(false);
  };

  const handleSendFriendRequest = (userId) => {
    sendFriendRequestMutation(userId);
  };

  return (
    <div className="relative" ref={searchRef}>
      {/* Search Input */}
      <div className="relative">
        <SearchIcon className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-base-content/50" />
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={handleInputChange}
          className="input input-bordered input-sm w-full max-w-xs sm:max-w-sm lg:max-w-md xl:max-w-lg pl-8 sm:pl-10 bg-base-100 border-base-content/20 focus:border-primary focus:outline-none transition-colors duration-200 text-sm"
        />
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-base-100 border border-base-300 rounded-lg shadow-xl z-50 max-h-80 sm:max-h-96 overflow-y-auto min-w-[280px] sm:min-w-0">
          {isLoading ? (
            <div className="p-4 text-center">
              <span className="loading loading-spinner loading-sm"></span>
              <p className="text-sm text-base-content/70 mt-2">Searching...</p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="p-4 text-center">
              <UserIcon className="w-8 h-8 text-base-content/30 mx-auto mb-2" />
              <p className="text-sm text-base-content/70">
                {searchQuery.length < 2
                  ? "Type at least 2 characters to search"
                  : "No users found"
                }
              </p>
            </div>
          ) : (
            <div className="py-2">
              {searchResults.map((user) => {
                const alreadyRequested = outgoingRequestsIds.has(user._id);
                const isFriend = friendIds.has(user._id);

                return (
                  <div
                    key={user._id}
                    className="flex items-center gap-3 px-3 sm:px-4 py-3 hover:bg-base-200 transition-colors min-w-0"
                  >
                    {/* Avatar */}
                    <div className="avatar flex-shrink-0">
                      <div className="w-10 h-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-1">
                        <img
                          src={getUserAvatar(user)}
                          alt={user.fullName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <p className="font-medium text-sm text-base-content truncate">
                        {user.fullName}
                      </p>
                      <div className="flex flex-col gap-1 text-xs text-base-content/70">
                        {user.nativeLanguage && (
                          <span className="flex items-center gap-1 truncate">
                            <span className="flex-shrink-0">{getLanguageFlag(user.nativeLanguage)}</span>
                            <span className="truncate">Native: {user.nativeLanguage}</span>
                          </span>
                        )}
                        {user.learningLanguage && (
                          <span className="flex items-center gap-1 truncate">
                            <span className="flex-shrink-0">{getLanguageFlag(user.learningLanguage)}</span>
                            <span className="truncate">Learning: {user.learningLanguage}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Status Button */}
                    <div className="flex-shrink-0">
                      {isFriend ? (
                        <div className="btn btn-xs btn-success btn-disabled">
                          <CheckCircleIcon className="w-3 h-3" />
                          <span className="hidden sm:inline">Friends</span>
                        </div>
                      ) : alreadyRequested ? (
                        <div className="btn btn-xs btn-warning btn-disabled">
                          <CheckCircleIcon className="w-3 h-3" />
                          <span className="hidden sm:inline">Sent</span>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSendFriendRequest(user._id);
                          }}
                          disabled={sendingRequest}
                          className="btn btn-xs btn-primary"
                        >
                          <UserPlusIcon className="w-3 h-3" />
                          <span className="hidden sm:inline">Add</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserSearch;
