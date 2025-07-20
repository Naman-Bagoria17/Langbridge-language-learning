import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { getUserFriends } from "../lib/api";
import { MapPinIcon, MessageCircleIcon } from "lucide-react";
import { capitialize } from "../lib/utils";
import { getLanguageFlag } from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";
import { getUserAvatar } from "../utils/avatar";

const FriendsPage = () => {

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
                className="group bg-gradient-to-br from-base-100 to-base-200 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-base-300/50 h-full flex flex-col"
              >
                {/* Header with Avatar and Name */}
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="relative mb-4">
                    <img
                      src={getUserAvatar(friend)}
                      alt={friend.fullName}
                      className="w-20 h-20 rounded-full object-cover ring-4 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full border-2 border-base-100 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>

                  <h4 className="text-xl font-bold text-base-content mb-1">{friend.fullName}</h4>

                  {friend.location && (
                    <div className="flex items-center gap-1 text-base-content/60 text-sm">
                      <MapPinIcon className="w-3 h-3" />
                      {friend.location}
                    </div>
                  )}
                </div>

                {/* Languages Section */}
                <div className="mb-6 space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-base-100/50 rounded-xl border border-base-300/30">
                    <div className="text-2xl">{getLanguageFlag(friend.nativeLanguage)}</div>
                    <div className="flex-1">
                      <p className="text-xs text-base-content/60 uppercase tracking-wide font-medium">Native</p>
                      <p className="text-sm font-semibold text-base-content">{capitialize(friend.nativeLanguage)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-base-100/50 rounded-xl border border-base-300/30">
                    <div className="text-2xl">{getLanguageFlag(friend.learningLanguage)}</div>
                    <div className="flex-1">
                      <p className="text-xs text-base-content/60 uppercase tracking-wide font-medium">Learning</p>
                      <p className="text-sm font-semibold text-base-content">{capitialize(friend.learningLanguage)}</p>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div className="flex-1 mb-6">
                  {friend.bio ? (
                    <div className="bg-base-100/30 rounded-xl p-4 border border-base-300/20">
                      <p className="text-xs text-base-content/60 uppercase tracking-wide font-medium mb-2">About</p>
                      <p className="text-sm text-base-content/80 leading-relaxed line-clamp-3">{friend.bio}</p>
                    </div>
                  ) : (
                    <div className="bg-base-100/20 rounded-xl p-4 border border-dashed border-base-300/40">
                      <p className="text-xs text-base-content/40 text-center italic">No bio available</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Link
                    to={`/chat/${friend._id}`}
                    className="btn btn-primary flex-1 rounded-xl border-0 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-content shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <MessageCircleIcon className="w-4 h-4" />
                    Chat
                  </Link>
                  <Link
                    to={`/call/${friend._id}`}
                    className="btn btn-square rounded-xl bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary border-0 text-secondary-content shadow-lg hover:shadow-xl transition-all duration-300"
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
