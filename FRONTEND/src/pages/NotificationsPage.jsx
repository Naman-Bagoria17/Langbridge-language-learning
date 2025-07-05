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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden flex items-start justify-center p-6">
      {/* Floating background blobs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute w-[500px] h-[500px] bg-emerald-500/10 rounded-full top-[-15%] left-[-10%] blur-3xl float-slow" />
        <div className="absolute w-[350px] h-[350px] bg-cyan-400/10 rounded-full bottom-[-10%] right-[-10%] blur-2xl float-medium" />
      </div>

      <div className="relative z-10 w-full max-w-3xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 space-y-10">
        {/* Page header */}
        <header>
          <h1 className="text-3xl font-bold text-white">Notifications</h1>
          <p className="text-slate-300 text-sm">
            Manage your friend requests and updates
          </p>
        </header>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-slate-500/30 border-t-emerald-500 rounded-full animate-spin" />
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
                    className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-5 shadow-md hover:shadow-emerald-600/10 transition"
                  >
                    <img
                      src={req.sender.profilePic}
                      alt={req.sender.fullName}
                      className="w-12 h-12 rounded-full border-2 border-emerald-400 object-cover"
                    />

                    <div className="flex-1">
                      <h3 className="text-white font-semibold">
                        {req.sender.fullName}
                      </h3>
                      <p className="text-slate-400 text-xs mt-0.5">
                        Native: {req.sender.nativeLanguage} • Learning:{" "}
                        {req.sender.learningLanguage}
                      </p>
                    </div>

                    <button
                      disabled={isPending}
                      onClick={() => acceptRequestMutation(req._id)}
                      className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition disabled:opacity-50"
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
                <h2 className="flex items-center gap-2 text-xl font-semibold text-cyan-300">
                  <BellIcon className="w-5 h-5" />
                  New Connections
                </h2>

                {accepted.map((note) => (
                  <div
                    key={note._id}
                    className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-xl p-5 shadow-md"
                  >
                    <img
                      src={note.recipient.profilePic}
                      alt={note.recipient.fullName}
                      className="w-10 h-10 rounded-full border-2 border-cyan-400 object-cover mt-0.5"
                    />

                    <div className="flex-1">
                      <p className="text-white text-sm">
                        <span className="font-semibold">
                          {note.recipient.fullName}
                        </span>{" "}
                        accepted your friend request
                      </p>
                      <p className="text-xs flex items-center text-slate-400 mt-1">
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
  );
};

export default NotificationsPage;
