import { UsersIcon } from "lucide-react";

const NoFriendsFound = () => {
  return (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-8 text-center text-white shadow-md">
      <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
        <UsersIcon className="w-8 h-8 text-emerald-400" />
      </div>
      <h3 className="font-semibold text-lg mb-2">No friends yet</h3>
      <p className="text-slate-400">
        Connect with language partners below to start practicing together!
      </p>
    </div>
  );
};

export default NoFriendsFound;
