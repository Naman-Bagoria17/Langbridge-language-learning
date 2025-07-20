import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getOutgoingFriendReqs,
  sendFriendRequest,
  getCoLearners,
  getNativeSpeakers,
} from "../lib/api";
import { CheckCircleIcon, MapPinIcon, UserPlusIcon } from "lucide-react";
import { capitialize } from "../lib/utils";
import { getLanguageFlag } from "../components/FriendCard";
import { getUserAvatar } from "../utils/avatar";
import useAuthUser from "../hooks/useAuthUser";

const HomePage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

  const { data: coLearners = [], isLoading: loadingCoLearners, refetch: refetchCoLearners, error: coLearnersError } = useQuery({
    queryKey: ["coLearners", authUser?.learningLanguage],
    queryFn: getCoLearners,
    enabled: !!authUser?.learningLanguage, // Only fetch if user has a learning language
  });

  const { data: nativeSpeakers = [], isLoading: loadingNativeSpeakers, refetch: refetchNativeSpeakers } = useQuery({
    queryKey: ["nativeSpeakers", authUser?.nativeLanguage],
    queryFn: getNativeSpeakers,
    enabled: !!authUser?.nativeLanguage, // Only fetch if user has a native language
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

  // Refetch co-learners and native speakers when authUser language changes
  useEffect(() => {
    if (authUser?.learningLanguage) {
      refetchCoLearners();
    }
  }, [authUser?.learningLanguage, refetchCoLearners]);

  useEffect(() => {
    if (authUser?.nativeLanguage) {
      refetchNativeSpeakers();
    }
  }, [authUser?.nativeLanguage, refetchNativeSpeakers]);

  const handleSendFriendRequest = (userId) => {
    sendRequestMutation(userId);
  };

  return (
    <div className="w-full h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-base-300">
        <h1 className="text-3xl font-bold text-base-content">Discover Language Partners</h1>
        <p className="text-base-content/70 mt-2">Connect with co-learners and native speakers</p>
      </div>

      {/* Main Content - Side by Side Containers */}
      <div className="flex-1 flex gap-6 p-6 min-h-0">

        {/* CO-LEARNERS CONTAINER */}
        <div className="flex-1 bg-base-100 rounded-lg border border-base-300 flex flex-col">
          <div className="p-4 border-b border-base-300">
            <h2 className="text-xl font-bold text-base-content flex items-center gap-2">
              Co-Learners
              <span className="badge badge-primary badge-sm">{coLearners.length}</span>
            </h2>
            <p className="text-base-content/70 text-sm mt-1">People learning the same language as you</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
            {loadingCoLearners ? (
              <div className="flex justify-center py-12">
                <span className="loading loading-spinner loading-lg text-primary"></span>
              </div>
            ) : coLearners.length === 0 ? (
              <div className="text-center text-base-content/70 py-12">
                <p>No co-learners found for your learning language.</p>
                <p className="text-sm mt-2">Try updating your learning language in your profile.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {coLearners.map((user) => {
                  const alreadyRequested = outgoingRequestsIds.has(user._id);

                  return (
                    <div
                      key={user._id}
                      className="card bg-base-200 border border-base-300 p-4 shadow-sm hover:shadow-md transition"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={getUserAvatar(user)}
                          alt={user.fullName}
                          className="w-12 h-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-1 object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-base-content">{user.fullName}</h4>
                          {user.location && (
                            <div className="flex items-center gap-1 text-primary text-xs">
                              <MapPinIcon className="w-3 h-3" />
                              {user.location}
                            </div>
                          )}

                          <div className="flex flex-wrap gap-1 mt-2">
                            <span className="badge badge-primary badge-xs gap-1">
                              {getLanguageFlag(user.nativeLanguage)} {capitialize(user.nativeLanguage)}
                            </span>
                            <span className="badge badge-secondary badge-xs gap-1">
                              {getLanguageFlag(user.learningLanguage)} {capitialize(user.learningLanguage)}
                            </span>
                          </div>

                          {user.bio && (
                            <p className="text-base-content/70 text-xs mt-2 line-clamp-2">{user.bio}</p>
                          )}

                          <button
                            disabled={alreadyRequested || isPending}
                            onClick={() => sendRequestMutation(user._id)}
                            className={`btn btn-xs mt-3 ${alreadyRequested
                              ? "btn-success btn-disabled"
                              : "btn-primary"
                              }`}
                          >
                            {alreadyRequested ? (
                              <>
                                <CheckCircleIcon className="w-3 h-3" />
                                Sent
                              </>
                            ) : (
                              <>
                                <UserPlusIcon className="w-3 h-3" />
                                Add Friend
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* NATIVE SPEAKERS CONTAINER */}
        <div className="flex-1 bg-base-100 rounded-lg border border-base-300 flex flex-col">
          <div className="p-4 border-b border-base-300">
            <h2 className="text-xl font-bold text-base-content flex items-center gap-2">
               Native Speakers
              <span className="badge badge-secondary badge-sm">{nativeSpeakers.length}</span>
            </h2>
            <p className="text-base-content/70 text-sm mt-1">People who share your native language</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-secondary/20 scrollbar-track-transparent">
            {loadingNativeSpeakers ? (
              <div className="flex justify-center py-12">
                <span className="loading loading-spinner loading-lg text-secondary"></span>
              </div>
            ) : nativeSpeakers.length === 0 ? (
              <div className="text-center text-base-content/70 py-12">
                <p>No native speakers found for your native language.</p>
                <p className="text-sm mt-2">Try updating your native language in your profile.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {nativeSpeakers.map((user) => {
                  const alreadyRequested = outgoingRequestsIds.has(user._id);

                  return (
                    <div
                      key={user._id}
                      className="card bg-base-200 border border-base-300 p-4 shadow-sm hover:shadow-md transition"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={getUserAvatar(user)}
                          alt={user.fullName}
                          className="w-12 h-12 rounded-full ring ring-secondary ring-offset-base-100 ring-offset-1 object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-base-content">{user.fullName}</h4>
                          {user.location && (
                            <div className="flex items-center gap-1 text-secondary text-xs">
                              <MapPinIcon className="w-3 h-3" />
                              {user.location}
                            </div>
                          )}

                          <div className="flex flex-wrap gap-1 mt-2">
                            <span className="badge badge-primary badge-xs gap-1">
                              {getLanguageFlag(user.nativeLanguage)} {capitialize(user.nativeLanguage)}
                            </span>
                            <span className="badge badge-secondary badge-xs gap-1">
                              {getLanguageFlag(user.learningLanguage)} {capitialize(user.learningLanguage)}
                            </span>
                          </div>

                          {user.bio && (
                            <p className="text-base-content/70 text-xs mt-2 line-clamp-2">{user.bio}</p>
                          )}

                          <button
                            onClick={() => handleSendFriendRequest(user._id)}
                            disabled={alreadyRequested || isPending}
                            className={`btn btn-xs mt-3 ${alreadyRequested
                              ? "btn-success btn-disabled"
                              : "btn-secondary"
                              }`}
                          >
                            {alreadyRequested ? (
                              <>
                                <CheckCircleIcon className="w-3 h-3" />
                                Sent
                              </>
                            ) : (
                              <>
                                <UserPlusIcon className="w-3 h-3" />
                                Add Friend
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
