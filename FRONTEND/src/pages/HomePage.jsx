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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background Floating Blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute w-[600px] h-[600px] bg-emerald-500/10 rounded-full top-[-20%] left-[-10%] blur-3xl animate-float-slow" />
        <div className="absolute w-[400px] h-[400px] bg-cyan-400/10 rounded-full bottom-[-10%] right-[-10%] blur-2xl animate-float" />
      </div>

      <div className="relative z-10 px-6 py-10 max-w-7xl mx-auto space-y-14">
        {/* FRIENDS SECTION */}
        <section>
          <h2 className="text-4xl font-bold text-white mb-3">Your Friends</h2>
          <p className="text-slate-300 mb-6">Your current language learning connections</p>

          {loadingFriends ? (
            <div className="flex justify-center py-12">
              <div className="w-10 h-10 border-4 border-slate-400/30 border-t-emerald-400 rounded-full animate-spin"></div>
            </div>
          ) : friends.length === 0 ? (
            <NoFriendsFound />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {friends.map((friend) => (
                <FriendCard key={friend._id} friend={friend} />
              ))}
            </div>
          )}
        </section>

        {/* RECOMMENDED USERS SECTION */}
        <section>
          <h2 className="text-4xl font-bold text-white mb-3">Meet New Learners</h2>
          <p className="text-slate-300 mb-6">Connect with new language partners around the world</p>

          {loadingUsers ? (
            <div className="flex justify-center py-12">
              <div className="w-10 h-10 border-4 border-slate-400/30 border-t-cyan-400 rounded-full animate-spin"></div>
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="text-center text-slate-300">No recommendations available at the moment.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {recommendedUsers.map((user) => {
                const alreadyRequested = outgoingRequestsIds.has(user._id);

                return (
                  <div
                    key={user._id}
                    className="bg-white/5 border border-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl hover:shadow-emerald-600/10 transition"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={user.profilePic}
                        alt={user.fullName}
                        className="w-16 h-16 rounded-full border-2 border-emerald-500 object-cover"
                      />
                      <div>
                        <h4 className="text-lg font-semibold text-white">{user.fullName}</h4>
                        {user.location && (
                          <div className="flex items-center gap-2 text-emerald-300 text-sm">
                            <MapPinIcon className="w-4 h-4" />
                            {user.location}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Language Chips */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="bg-emerald-100/10 text-emerald-300 px-3 py-1 rounded-full text-sm border border-emerald-300/30">
                        {getLanguageFlag(user.nativeLanguage)} Native: {capitialize(user.nativeLanguage)}
                      </span>
                      <span className="bg-cyan-100/10 text-cyan-300 px-3 py-1 rounded-full text-sm border border-cyan-300/30">
                        {getLanguageFlag(user.learningLanguage)} Learning: {capitialize(user.learningLanguage)}
                      </span>
                    </div>

                    {/* Bio */}
                    {user.bio && <p className="text-slate-300 text-sm mb-4">{user.bio}</p>}

                    {/* Button */}
                    <button
                      disabled={alreadyRequested || isPending}
                      onClick={() => sendRequestMutation(user._id)}
                      className={`w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition ${alreadyRequested
                          ? "bg-green-800/10 text-green-400 border border-green-500/20 cursor-not-allowed"
                          : "bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white"
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
