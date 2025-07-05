import { VideoIcon } from "lucide-react";

function CallButton({ handleVideoCall }) {
  return (
    <div className="p-3 backdrop-blur-lg bg-white/5 border-b border-white/10 flex items-center justify-end max-w-7xl mx-auto w-full absolute top-0 z-20">
      <button
        onClick={handleVideoCall}
        className="btn btn-sm bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:from-emerald-600 hover:to-cyan-600 border-none"
      >
        <VideoIcon className="size-5" />
      </button>
    </div>
  );
}

export default CallButton;
