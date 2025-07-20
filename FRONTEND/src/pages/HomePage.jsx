import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
} from "../lib/api";
import { CheckCircleIcon, MapPinIcon, UserPlusIcon } from "lucide-react";
import { capitialize } from "../lib/utils";
import FriendCard, { getLanguageFlag } from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";
import { getUserAvatar } from "../utils/avatar";

const HomePage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }),
  });

  useEffect(() => {
    const ids = new Set();
    if (outgoingFriendReqs) {
      outgoingFriendReqs.forEach((req) => ids.add(req.recipient._id));
      setOutgoingRequestsIds(ids);
    }
  }, [outgoingFriendReqs]);

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* FRIENDS SECTION */}
        <section>
          <h2 className="text-4xl font-bold text-base-content mb-3">Your Friends</h2>
          <p className="text-base-content/70 mb-6">Your current language learning connections</p>

          {loadingFriends ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : friends.length === 0 ? (
            <NoFriendsFound />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {friends.map((friend) => (
                <FriendCard key={friend._id} friend={friend} />
              ))}
            </div>
          )}
        </section>

        {/* RECOMMENDED USERS SECTION */}
        <section>
          <h2 className="text-4xl font-bold text-base-content mb-3">Meet New Learners</h2>
          <p className="text-base-content/70 mb-6">Connect with new language partners around the world</p>

          {loadingUsers ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="text-center text-base-content/70">No recommendations available at the moment.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedUsers.map((user) => {
                const alreadyRequested = outgoingRequestsIds.has(user._id);

                return (
                  <div
                    key={user._id}
                    className="card bg-base-200 border border-base-300 p-6 shadow-lg hover:shadow-xl transition h-full flex flex-col"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={getUserAvatar(user)}
                        alt={user.fullName}
                        className="w-16 h-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 object-cover"
                      />
                      <div>
                        <h4 className="text-lg font-semibold text-base-content">{user.fullName}</h4>
                        {user.location && (
                          <div className="flex items-center gap-2 text-primary text-sm">
                            <MapPinIcon className="w-4 h-4" />
                            {user.location}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Language Chips */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="badge badge-primary gap-1">
                        {getLanguageFlag(user.nativeLanguage)} Native: {capitialize(user.nativeLanguage)}
                      </span>
                      <span className="badge badge-secondary gap-1">
                        {getLanguageFlag(user.learningLanguage)} Learning: {capitialize(user.learningLanguage)}
                      </span>
                    </div>

                    {/* Bio */}
                    <div className="flex-1">
                      {user.bio && <p className="text-base-content/70 text-sm mb-4">{user.bio}</p>}
                    </div>

                    {/* Button */}
                    <button
                      disabled={alreadyRequested || isPending}
                      onClick={() => sendRequestMutation(user._id)}
                      className={`btn w-full ${alreadyRequested
                        ? "btn-success btn-disabled"
                        : "btn-primary"
                        }`}
                    >
                      {alreadyRequested ? (
                        <>
                          <CheckCircleIcon className="w-5 h-5" />
                          Request Sent
                        </>
                      ) : (
                        <>
                          <UserPlusIcon className="w-5 h-5" />
                          Send Friend Request
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
