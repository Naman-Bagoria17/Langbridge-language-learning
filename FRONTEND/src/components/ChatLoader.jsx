import { LoaderIcon } from "lucide-react";

function ChatLoader() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center text-white p-6">
      <LoaderIcon className="animate-spin size-10 text-emerald-400" />
      <p className="mt-4 text-lg font-mono text-slate-300">Connecting to chat...</p>
    </div>
  );
}

export default ChatLoader;
