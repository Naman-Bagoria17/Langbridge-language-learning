import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getOutgoingFriendReqs,
  sendFriendRequest,
  getCoLearners,
  getNativeSpeakers,
  getLanguageTeachers,
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

  const { data: coLearners = [], isLoading: loadingCoLearners, refetch: refetchCoLearners } = useQuery({
    queryKey: ["coLearners", authUser?.learningLanguage],
    queryFn: getCoLearners,
    enabled: !!authUser?.learningLanguage, // Only fetch if user has a learning language
  });

  const { data: nativeSpeakers = [], isLoading: loadingNativeSpeakers, refetch: refetchNativeSpeakers } = useQuery({
    queryKey: ["nativeSpeakers", authUser?.nativeLanguage],
    queryFn: getNativeSpeakers,
    enabled: !!authUser?.nativeLanguage, // Only fetch if user has a native language
  });

  const { data: languageTeachers = [], isLoading: loadingLanguageTeachers, refetch: refetchLanguageTeachers } = useQuery({
    queryKey: ["languageTeachers", authUser?.learningLanguage],
    queryFn: getLanguageTeachers,
    enabled: !!authUser?.learningLanguage, // Only fetch if user has a learning language
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

  useEffect(() => {
    if (authUser?.learningLanguage) {
      refetchLanguageTeachers();
    }
  }, [authUser?.learningLanguage, refetchLanguageTeachers]);

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

      {/* Main Content - Three Column Layout */}
      <div className="flex-1 flex gap-4 p-6 min-h-0">

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
              </div>
            ) : (
              <div className="space-y-3">
                {coLearners.map((user) => {
                  const alreadyRequested = outgoingRequestsIds.has(user._id);

                  return (
                    <div
                      key={user._id}
                      className="group bg-gradient-to-br from-base-100 to-base-200 rounded-lg p-3 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 border border-base-300/50"
                    >
                      {/* Header with Avatar and Name */}
                      <div className="flex items-start gap-3 mb-3">
                        <div className="relative flex-shrink-0">
                          <img
                            src={getUserAvatar(user)}
                            alt={user.fullName}
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300"
                          />
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border border-base-100 flex items-center justify-center">
                            <div className="w-1 h-1 bg-white rounded-full"></div>
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-base-content mb-0.5">{user.fullName}</h4>

                          {user.location && (
                            <div className="flex items-center gap-1 text-base-content/60 text-xs">
                              <MapPinIcon className="w-2.5 h-2.5" />
                              {user.location}
                            </div>
                          )}
                        </div>

                        <button
                          disabled={alreadyRequested || isPending}
                          onClick={() => sendRequestMutation(user._id)}
                          className={`btn btn-xs rounded-md border-0 shadow-sm hover:shadow-md transition-all duration-300 flex-shrink-0 ${alreadyRequested
                            ? "btn-success bg-gradient-to-r from-success to-success/80"
                            : "btn-primary bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
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
                              Add
                            </>
                          )}
                        </button>
                      </div>

                      {/* Languages and Bio Section */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 p-1.5 bg-base-100/50 rounded-md border border-base-300/30">
                          <div className="text-sm">{getLanguageFlag(user.nativeLanguage)}</div>
                          <div>
                            <p className="text-xs text-base-content/60 uppercase tracking-wide font-medium">Native</p>
                            <p className="text-xs font-semibold text-base-content">{capitialize(user.nativeLanguage)}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 p-1.5 bg-base-100/50 rounded-md border border-base-300/30">
                          <div className="text-sm">{getLanguageFlag(user.learningLanguage)}</div>
                          <div>
                            <p className="text-xs text-base-content/60 uppercase tracking-wide font-medium">Learning</p>
                            <p className="text-xs font-semibold text-base-content">{capitialize(user.learningLanguage)}</p>
                          </div>
                        </div>

                        {user.bio && (
                          <div className="flex-1 bg-base-100/30 rounded-md p-2 border border-base-300/20">
                            <p className="text-xs text-base-content/80 leading-relaxed line-clamp-1">{user.bio}</p>
                          </div>
                        )}
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
              </div>
            ) : (
              <div className="space-y-3">
                {nativeSpeakers.map((user) => {
                  const alreadyRequested = outgoingRequestsIds.has(user._id);

                  return (
                    <div
                      key={user._id}
                      className="group bg-gradient-to-br from-base-100 to-base-200 rounded-lg p-3 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 border border-base-300/50"
                    >
                      {/* Header with Avatar and Name */}
                      <div className="flex items-start gap-3 mb-3">
                        <div className="relative flex-shrink-0">
                          <img
                            src={getUserAvatar(user)}
                            alt={user.fullName}
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-secondary/20 group-hover:ring-secondary/40 transition-all duration-300"
                          />
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border border-base-100 flex items-center justify-center">
                            <div className="w-1 h-1 bg-white rounded-full"></div>
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-base-content mb-0.5">{user.fullName}</h4>

                          {user.location && (
                            <div className="flex items-center gap-1 text-base-content/60 text-xs">
                              <MapPinIcon className="w-2.5 h-2.5" />
                              {user.location}
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => handleSendFriendRequest(user._id)}
                          disabled={alreadyRequested || isPending}
                          className={`btn btn-xs rounded-md border-0 shadow-sm hover:shadow-md transition-all duration-300 flex-shrink-0 ${alreadyRequested
                            ? "btn-success bg-gradient-to-r from-success to-success/80"
                            : "btn-secondary bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary"
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
                              Add
                            </>
                          )}
                        </button>
                      </div>

                      {/* Languages and Bio Section */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 p-1.5 bg-secondary/10 rounded-md border border-base-300/30">
                          <div className="text-sm">{getLanguageFlag(user.nativeLanguage)}</div>
                          <div>
                            <p className="text-xs text-base-content/60 uppercase tracking-wide font-medium">Native</p>
                            <p className="text-xs font-semibold text-secondary">{capitialize(user.nativeLanguage)}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 p-1.5 bg-base-100/50 rounded-md border border-base-300/30">
                          <div className="text-sm">{getLanguageFlag(user.learningLanguage)}</div>
                          <div>
                            <p className="text-xs text-base-content/60 uppercase tracking-wide font-medium">Learning</p>
                            <p className="text-xs font-semibold text-base-content">{capitialize(user.learningLanguage)}</p>
                          </div>
                        </div>

                        {user.bio && (
                          <div className="flex-1 bg-base-100/30 rounded-md p-2 border border-base-300/20">
                            <p className="text-xs text-base-content/80 leading-relaxed line-clamp-1">{user.bio}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* LANGUAGE TEACHERS CONTAINER */}
        <div className="flex-1 bg-base-100 rounded-lg border border-base-300 flex flex-col">
          <div className="p-4 border-b border-base-300">
            <h2 className="text-xl font-bold text-base-content flex items-center gap-2">
              Language Teachers
              <span className="badge badge-accent badge-sm">{languageTeachers.length}</span>
            </h2>
            <p className="text-base-content/70 text-sm mt-1">Native speakers of your learning language</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-accent/20 scrollbar-track-transparent">
            {loadingLanguageTeachers ? (
              <div className="flex justify-center py-12">
                <span className="loading loading-spinner loading-lg text-accent"></span>
              </div>
            ) : languageTeachers.length === 0 ? (
              <div className="text-center text-base-content/70 py-12">
                <p>No language teachers found for your learning language.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {languageTeachers.map((user) => {
                  const alreadyRequested = outgoingRequestsIds.has(user._id);

                  return (
                    <div
                      key={user._id}
                      className="group bg-gradient-to-br from-base-100 to-base-200 rounded-lg p-3 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 border border-base-300/50"
                    >
                      {/* Header with Avatar and Name */}
                      <div className="flex items-start gap-3 mb-3">
                        <div className="relative flex-shrink-0">
                          <img
                            src={getUserAvatar(user)}
                            alt={user.fullName}
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-accent/20 group-hover:ring-accent/40 transition-all duration-300"
                          />
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border border-base-100 flex items-center justify-center">
                            <div className="w-1 h-1 bg-white rounded-full"></div>
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-base-content mb-0.5">{user.fullName}</h4>

                          {user.location && (
                            <div className="flex items-center gap-1 text-base-content/60 text-xs">
                              <MapPinIcon className="w-2.5 h-2.5" />
                              {user.location}
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => handleSendFriendRequest(user._id)}
                          disabled={alreadyRequested || isPending}
                          className={`btn btn-xs rounded-md border-0 shadow-sm hover:shadow-md transition-all duration-300 flex-shrink-0 ${alreadyRequested
                            ? "btn-success bg-gradient-to-r from-success to-success/80"
                            : "btn-accent bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent"
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
                              Add
                            </>
                          )}
                        </button>
                      </div>

                      {/* Languages and Bio Section */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 p-1.5 bg-accent/10 rounded-md border border-base-300/30">
                          <div className="text-sm">{getLanguageFlag(user.nativeLanguage)}</div>
                          <div>
                            <p className="text-xs text-base-content/60 uppercase tracking-wide font-medium">Native</p>
                            <p className="text-xs font-semibold text-accent">{capitialize(user.nativeLanguage)}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 p-1.5 bg-base-100/50 rounded-md border border-base-300/30">
                          <div className="text-sm">{getLanguageFlag(user.learningLanguage)}</div>
                          <div>
                            <p className="text-xs text-base-content/60 uppercase tracking-wide font-medium">Learning</p>
                            <p className="text-xs font-semibold text-base-content">{capitialize(user.learningLanguage)}</p>
                          </div>
                        </div>

                        {user.bio && (
                          <div className="flex-1 bg-base-100/30 rounded-md p-2 border border-base-300/20">
                            <p className="text-xs text-base-content/80 leading-relaxed line-clamp-1">{user.bio}</p>
                          </div>
                        )}
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
