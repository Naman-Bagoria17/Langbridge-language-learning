import { LoaderIcon } from "lucide-react";

function ChatLoader() {
  return (
    <div className="min-h-screen bg-base-100 flex flex-col items-center justify-center p-6">
      <span className="loading loading-spinner loading-lg text-primary"></span>
      <p className="mt-4 text-lg font-mono text-base-content">Connecting to chat...</p>
    </div>
  );
}

export default ChatLoader;
