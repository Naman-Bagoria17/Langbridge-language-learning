import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import {
  BellIcon,
  LogOutIcon,
  GraduationCapIcon,
} from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");
  const { logoutMutation } = useLogout();

  return (
    <nav className="bg-white/5 backdrop-blur-lg border-b border-white/10 sticky top-0 z-30 h-16 flex items-center">
      <div className="container mx-auto px-4 flex items-center justify-between w-full text-white">
        {/* Logo on chat pages */}
        {isChatPage && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-tr from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <GraduationCapIcon className="w-4 h-4 text-white" />
            </div>
            <Link to="/" className="text-xl font-bold">
              LangBridge
            </Link>
          </div>
        )}

        {/* Right Side */}
        <div className="flex items-center gap-4 ml-auto">
          <Link to="/notifications">
            <button className="relative p-2 rounded-lg hover:bg-white/10 transition">
              <BellIcon className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
            </button>
          </Link>

          <ThemeSelector />

          {/* User Profile Dropdown */}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/10 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20">
                <img
                  src={authUser?.profilePic}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow-xl bg-white/10 backdrop-blur-lg rounded-xl w-56 border border-white/10"
            >
              <li className="border-b border-white/10 px-3 py-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20">
                    <img src={authUser?.profilePic} alt="Profile" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{authUser?.fullName}</p>
                    <p className="text-xs text-slate-300">{authUser?.email}</p>
                  </div>
                </div>
              </li>
              <li className="pt-2">
                <button
                  onClick={logoutMutation}
                  className="flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-red-400/10 rounded-lg transition"
                >
                  <LogOutIcon className="w-4 h-4" />
                  Sign Out
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
