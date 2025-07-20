import { VideoIcon } from "lucide-react";

function CallButton({ handleVideoCall }) {
  return (
    <div className="p-3 bg-base-200 border-b border-base-300 flex items-center justify-end max-w-7xl mx-auto w-full absolute top-0 z-20">
      <button
        onClick={handleVideoCall}
        className="btn btn-sm btn-primary"
      >
        <VideoIcon className="size-5" />
      </button>
    </div>
  );
}

export default CallButton;
