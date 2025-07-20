import { UsersIcon } from "lucide-react";

const NoFriendsFound = () => {
  return (
    <div className="bg-base-200 border border-base-300 rounded-xl p-8 text-center shadow-md">
      <div className="w-16 h-16 bg-base-300 rounded-full flex items-center justify-center mx-auto mb-4">
        <UsersIcon className="w-8 h-8 text-primary" />
      </div>
      <h3 className="font-semibold text-lg mb-2 text-base-content">No friends yet</h3>
      <p className="text-base-content/70">
        Connect with language partners below to start practicing together!
      </p>
    </div>
  );
};

export default NoFriendsFound;
