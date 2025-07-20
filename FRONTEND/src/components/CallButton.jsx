import { VideoIcon } from "lucide-react";

function CallButton({ handleVideoCall }) {
  return (
    <div className="p-4 bg-base-100 border-b border-base-content/10 flex items-center justify-end w-full absolute top-0 z-20 shadow-sm">
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
