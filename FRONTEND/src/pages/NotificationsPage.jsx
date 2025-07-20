import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  acceptFriendRequest,
  getFriendRequests,
} from "../lib/api";
import {
  BellIcon,
  ClockIcon,
  MessageSquareIcon,
  UserCheckIcon,
  CheckCircleIcon,
} from "lucide-react";
import NoNotificationsFound from "../components/NoNotificationsFound";
import { getUserAvatar } from "../utils/avatar";

const NotificationsPage = () => {
  const queryClient = useQueryClient();

  const { data: friendRequests, isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const { mutate: acceptRequestMutation, isPending } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  const incoming = friendRequests?.incomingReqs || [];
  const accepted = friendRequests?.acceptedReqs || [];

  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto">
        <div className="bg-base-200 border border-base-300 rounded-2xl shadow-xl p-8 space-y-8">
          {/* Page header */}
          <header>
            <h1 className="text-3xl font-bold text-base-content">Notifications</h1>
            <p className="text-base-content/70 text-sm">
              Manage your friend requests and updates
            </p>
          </header>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : (
            <>
              {/* Friend Requests */}
              {incoming.length > 0 && (
                <section className="space-y-6">
                  <h2 className="flex items-center gap-2 text-xl font-semibold text-emerald-300">
                    <UserCheckIcon className="w-5 h-5" />
                    Friend Requests
                    <span className="ml-1 bg-emerald-600/20 text-emerald-200 px-2 py-0.5 rounded-full text-xs">
                      {incoming.length}
                    </span>
                  </h2>

                  {incoming.map((req) => (
                    <div
                      key={req._id}
                      className="flex items-center gap-4 bg-base-300 border border-base-300 rounded-xl p-6 shadow-md hover:shadow-lg transition"
                    >
                      <img
                        src={getUserAvatar(req.sender)}
                        alt={req.sender.fullName}
                        className="w-12 h-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 object-cover"
                      />

                      <div className="flex-1">
                        <h3 className="text-base-content font-semibold">
                          {req.sender.fullName}
                        </h3>
                        <p className="text-base-content/70 text-xs mt-0.5">
                          Native: {req.sender.nativeLanguage} • Learning:{" "}
                          {req.sender.learningLanguage}
                        </p>
                      </div>

                      <button
                        disabled={isPending}
                        onClick={() => acceptRequestMutation(req._id)}
                        className="btn btn-primary btn-sm"
                      >
                        Accept
                      </button>
                    </div>
                  ))}
                </section>
              )}

              {/* Accepted Notifications */}
              {accepted.length > 0 && (
                <section className="space-y-6">
                  <h2 className="flex items-center gap-2 text-xl font-semibold text-secondary">
                    <BellIcon className="w-5 h-5" />
                    New Connections
                  </h2>

                  {accepted.map((note) => (
                    <div
                      key={note._id}
                      className="flex items-start gap-4 bg-base-300 border border-base-300 rounded-xl p-5 shadow-md"
                    >
                      <img
                        src={getUserAvatar(note.recipient)}
                        alt={note.recipient.fullName}
                        className="w-10 h-10 rounded-full ring ring-secondary ring-offset-base-100 ring-offset-2 object-cover mt-0.5"
                      />

                      <div className="flex-1">
                        <p className="text-base-content text-sm">
                          <span className="font-semibold">
                            {note.recipient.fullName}
                          </span>{" "}
                          accepted your friend request
                        </p>
                        <p className="text-xs flex items-center text-base-content/70 mt-1">
                          <ClockIcon className="w-3 h-3 mr-1" />
                          Recently
                        </p>
                      </div>

                      <span className="flex items-center gap-1 bg-emerald-600/20 text-emerald-200 px-2 py-1 rounded-full text-xs">
                        <MessageSquareIcon className="w-3 h-3" />
                        New Friend
                      </span>
                    </div>
                  ))}
                </section>
              )}

              {incoming.length === 0 && accepted.length === 0 && (
                <NoNotificationsFound />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
