import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import {
  BellIcon,
  LogOutIcon,
  GraduationCapIcon,
  GlobeIcon,
} from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";
import { getUserAvatar } from "../utils/avatar";
import UserSearch from "./UserSearch";
import LanguageSelector from "./LanguageSelector";
import { useState, useRef, useEffect } from "react";
import { capitialize } from "../lib/utils";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");
  const { logoutMutation } = useLogout();
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setShowLanguageSelector(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageSelectorClose = () => {
    setShowLanguageSelector(false);
    // Keep dropdown open
  };

  return (
    <nav className="navbar bg-base-200 border-b border-base-300 sticky top-0 z-30">
      <div className="container mx-auto px-4 flex items-center justify-between w-full">
        {/* Logo on chat pages */}
        {isChatPage && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <GraduationCapIcon className="w-4 h-4 text-primary-content" />
            </div>
            <Link to="/" className="text-xl font-bold text-base-content">
              LangBridge
            </Link>
          </div>
        )}

        {/* Center - Search */}
        <div className="flex-1 flex justify-center max-w-md mx-4">
          <UserSearch />
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <Link to="/notifications">
            <button className="btn btn-ghost btn-circle">
              <div className="indicator">
                <BellIcon className="w-5 h-5" />
                <span className="badge badge-xs badge-primary indicator-item"></span>
              </div>
            </button>
          </Link>

          {/* Theme Selector */}
          <ThemeSelector />

          {/* User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="btn btn-ghost flex items-center gap-2"
            >
              <div className="avatar">
                <div className="w-8 h-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-1">
                  <img
                    src={getUserAvatar(authUser)}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </button>

            {/* Custom Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-base-200 rounded-xl shadow-xl border border-base-300 z-50">
                <ul className="menu p-0">
                  <li className="border-b border-base-300 px-3 py-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="avatar flex-shrink-0">
                        <div className="w-10 h-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-1">
                          <img src={getUserAvatar(authUser)} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-base-content truncate">{authUser?.fullName}</p>
                        <p className="text-xs text-base-content/70 break-all">{authUser?.email}</p>
                        {authUser?.learningLanguage && (
                          <p className="text-xs text-primary mt-1">
                            Learning: {capitialize(authUser.learningLanguage)}
                          </p>
                        )}
                      </div>
                    </div>
                  </li>

                  {/* Language Selector */}
                  <li className="border-b border-base-300">
                    {showLanguageSelector ? (
                      <div onClick={(e) => e.stopPropagation()}>
                        <LanguageSelector
                          currentLanguage={authUser?.learningLanguage || ""}
                          onClose={handleLanguageSelectorClose}
                        />
                      </div>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowLanguageSelector(true);
                        }}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-base-300 w-full text-left"
                      >
                        <GlobeIcon className="w-4 h-4 text-primary" />
                        <span className="text-sm">Change Learning Language</span>
                      </button>
                    )}
                  </li>

                  <li className="pt-2 px-1">
                    <button
                      onClick={logoutMutation}
                      className="btn btn-ghost btn-sm text-error hover:bg-error/10 w-full justify-start"
                    >
                      <LogOutIcon className="w-4 h-4" />
                      Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
