import { LoaderIcon } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";

const PageLoader = () => {
  const { theme } = useThemeStore();
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white"
      data-theme={theme}
    >
      <LoaderIcon className="animate-spin size-10 text-emerald-400" />
    </div>
  );
};
export default PageLoader;
