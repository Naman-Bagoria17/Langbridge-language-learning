import { BellIcon } from "lucide-react";

function NoNotificationsFound() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center text-white bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="size-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
        <BellIcon className="size-8 text-emerald-400" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No notifications yet</h3>
      <p className="text-slate-400 max-w-md">
        When you receive friend requests or messages, they'll appear here.
      </p>
    </div>
  );
}

export default NoNotificationsFound;
