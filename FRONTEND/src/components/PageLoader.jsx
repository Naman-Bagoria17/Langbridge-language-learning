import { LoaderIcon } from "lucide-react";

const PageLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <LoaderIcon className="animate-spin size-10 text-emerald-400" />
    </div>
  );
};
export default PageLoader;
