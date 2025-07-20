import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { getUserFriends } from "../lib/api";
import { MapPinIcon, MessageCircleIcon } from "lucide-react";
import { capitialize } from "../lib/utils";
import { getLanguageFlag } from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";
import { getUserAvatar } from "../utils/avatar";
import useAuthUser from "../hooks/useAuthUser";

const FriendsPage = () => {
  const { authUser } = useAuthUser();

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  return (
    <div className="w-full h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-base-300">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-base-content flex items-center gap-3">
               Your Friends
              <span className="badge badge-primary badge-lg">{friends.length}</span>
            </h1>
            <p className="text-base-content/70 mt-2">Your language learning connections</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {loadingFriends ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {friends.map((friend) => (
              <div
                key={friend._id}
                className="card bg-base-200 border border-base-300 p-6 shadow-lg hover:shadow-xl transition h-full flex flex-col"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={getUserAvatar(friend)}
                    alt={friend.fullName}
                    className="w-16 h-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 object-cover"
                  />
                  <div>
                    <h4 className="text-lg font-semibold text-base-content">{friend.fullName}</h4>
                    {friend.location && (
                      <div className="flex items-center gap-2 text-primary text-sm">
                        <MapPinIcon className="w-4 h-4" />
                        {friend.location}
                      </div>
                    )}
                  </div>
                </div>

                {/* Language Chips */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="badge badge-primary gap-1">
                    {getLanguageFlag(friend.nativeLanguage)} Native: {capitialize(friend.nativeLanguage)}
                  </span>
                  <span className="badge badge-secondary gap-1">
                    {getLanguageFlag(friend.learningLanguage)} Learning: {capitialize(friend.learningLanguage)}
                  </span>
                </div>

                {/* Bio */}
                <div className="flex-1">
                  {friend.bio && <p className="text-base-content/70 text-sm mb-4">{friend.bio}</p>}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Link
                    to={`/chat/${friend._id}`}
                    className="btn btn-primary flex-1"
                  >
                    <MessageCircleIcon className="w-4 h-4" />
                    Chat
                  </Link>
                  <Link
                    to={`/call/${friend._id}`}
                    className="btn btn-secondary"
                  >
                    📞
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsPage;
