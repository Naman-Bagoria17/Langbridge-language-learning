import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, HomeIcon, GraduationCapIcon, UsersIcon, XIcon } from "lucide-react";
import { getUserAvatar } from "../utils/avatar";

const Sidebar = ({ isMobile = false, onClose }) => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;

  const handleLinkClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  const navItems = [
    { path: "/", icon: HomeIcon, label: "Home" },
    { path: "/notifications", icon: BellIcon, label: "Notifications" },
    { path: "/friends", icon: UsersIcon, label: "Friends" },
  ];

  return (
    <aside className={`w-64 ${isMobile ? 'flex' : 'hidden lg:flex'} flex-col h-screen bg-base-200 border-r border-base-300 shadow-md`}>
      {/* Logo and Close Button */}
      <div className="p-4 sm:p-6 border-b border-base-300">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3" onClick={handleLinkClick}>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-xl flex items-center justify-center">
              <GraduationCapIcon className="w-4 h-4 sm:w-5 sm:h-5 text-primary-content" />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-base-content">LangBridge</span>
          </Link>
          {/* Close button for mobile */}
          {isMobile && (
            <button
              onClick={onClose}
              className="btn btn-ghost btn-sm btn-circle lg:hidden"
            >
              <XIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 sm:p-4 space-y-1 sm:space-y-2">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = currentPath === path;
          return (
            <Link
              to={path}
              key={path}
              onClick={handleLinkClick}
              className={`flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition ${isActive
                ? "bg-primary/20 border-l-4 border-primary text-base-content"
                : "hover:bg-base-300 text-base-content/70"
                }`}
            >
              <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-medium text-sm sm:text-base">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User info */}
      <div className="p-3 sm:p-4 border-t border-base-300 mt-auto">
        <div className="flex items-center gap-2 sm:gap-3 bg-base-300 p-2 sm:p-3 rounded-lg">
          <div className="avatar">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-1">
              <img src={getUserAvatar(authUser)} alt="Profile" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-semibold text-base-content truncate">{authUser?.fullName}</p>
            <div className="flex items-center gap-1.5">
              <div className="relative flex items-center justify-center">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-success rounded-full"></div>
                <div className="absolute w-1.5 h-1.5 sm:w-2 sm:h-2 bg-success rounded-full animate-ping opacity-75"></div>
              </div>
              <span className="text-xs text-base-content/70 font-medium">Online</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
