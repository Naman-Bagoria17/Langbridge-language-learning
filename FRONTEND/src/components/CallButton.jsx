import { VideoIcon, InfoIcon } from "lucide-react";
import { getUserAvatar } from "../utils/avatar";

function CallButton({ handleVideoCall, friend }) {
  return (
    <div className="p-2 sm:p-4 bg-base-100 border-b border-base-content/10 flex items-center justify-between w-full absolute top-0 z-20 shadow-sm">
      {/* Friend Profile Section */}
      {friend && (
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="avatar">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-1">
              <img
                src={getUserAvatar(friend)}
                alt={friend.fullName}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 min-w-0">
            <div className="min-w-0">
              <h3 className="font-semibold text-base-content text-xs sm:text-sm truncate">{friend.fullName}</h3>
              <p className="text-xs text-base-content/60 hidden sm:block">
                {friend.nativeLanguage} • {friend.learningLanguage}
              </p>
            </div>
            {friend.bio && (
              <div className="relative">
                <InfoIcon className="w-3 h-3 sm:w-4 sm:h-4 text-base-content/40 hover:text-primary cursor-help transition-colors peer" />
                <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-2 bg-base-300 text-base-content text-xs rounded-lg shadow-lg opacity-0 peer-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 max-w-xs">
                  <div className="text-left">
                    <p className="leading-relaxed">{friend.bio}</p>
                  </div>
                  <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-base-300"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Video Call Button */}
      <button
        onClick={handleVideoCall}
        className="btn btn-sm btn-primary shadow-md hover:shadow-lg transition-all duration-200"
        title="Start video call"
      >
        <VideoIcon className="w-4 h-4" />
        <span className="hidden sm:inline">Video Call</span>
      </button>
    </div>
  );
}

export default CallButton;
