import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, HomeIcon, GraduationCapIcon } from "lucide-react";
import { getUserAvatar } from "../utils/avatar";

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { path: "/", icon: HomeIcon, label: "Home" },
    { path: "/notifications", icon: BellIcon, label: "Notifications" },
  ];

  return (
    <aside className="w-64 hidden lg:flex flex-col h-screen bg-base-200 border-r border-base-300 shadow-md">
      {/* Logo */}
      <div className="p-6 border-b border-base-300">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <GraduationCapIcon className="w-5 h-5 text-primary-content" />
          </div>
          <span className="text-2xl font-bold text-base-content">LangBridge</span>
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
                ? "bg-primary/20 border-l-4 border-primary text-base-content"
                : "hover:bg-base-300 text-base-content/70"
                }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User info */}
      <div className="p-4 border-t border-base-300 mt-auto">
        <div className="flex items-center gap-3 bg-base-300 p-3 rounded-lg">
          <div className="avatar">
            <div className="w-10 h-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-1">
              <img src={getUserAvatar(authUser)} alt="Profile" className="w-full h-full object-cover" />
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-base-content">{authUser?.fullName}</p>
            <p className="text-xs text-success flex items-center gap-1">
              <span className="w-2 h-2 bg-success rounded-full"></span>
              Online
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
