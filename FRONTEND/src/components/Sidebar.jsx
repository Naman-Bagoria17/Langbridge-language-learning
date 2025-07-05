import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, HomeIcon, GraduationCapIcon } from "lucide-react";

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { path: "/", icon: HomeIcon, label: "Home" },
    { path: "/notifications", icon: BellIcon, label: "Notifications" },
  ];

  return (
    <aside className="w-64 hidden lg:flex flex-col h-screen sticky top-0 bg-white/5 border-r border-white/10 shadow-md backdrop-blur-lg text-white">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <GraduationCapIcon className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold">LangBridge</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = currentPath === path;
          return (
            <Link
              to={path}
              key={path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive
                ? "bg-emerald-600/20 border-l-4 border-emerald-400 text-white"
                : "hover:bg-white/10 text-slate-300"
                }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User info */}
      <div className="p-4 border-t border-white/10 mt-auto">
        <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
            <img src={authUser?.profilePic} alt="Profile" />
          </div>
          <div>
            <p className="text-sm font-semibold">{authUser?.fullName}</p>
            <p className="text-xs text-emerald-400">Online</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
