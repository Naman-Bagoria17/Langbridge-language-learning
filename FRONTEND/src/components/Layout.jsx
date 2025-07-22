import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children, showSidebar = false }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <div className="flex h-screen">
        {/* Desktop Sidebar */}
        {showSidebar && <Sidebar />}

        {/* Mobile Sidebar Overlay */}
        {showSidebar && (
          <>
            {/* Backdrop */}
            <div
              className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 lg:hidden ${isMobileMenuOpen ? 'bg-opacity-50' : 'bg-opacity-0 pointer-events-none'
                }`}
              onClick={closeMobileMenu}
            />
            {/* Mobile Sidebar */}
            <div
              className={`fixed inset-y-0 left-0 z-50 lg:hidden transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
              <Sidebar isMobile={true} onClose={closeMobileMenu} />
            </div>
          </>
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar
            showSidebar={showSidebar}
            onToggleMobileMenu={toggleMobileMenu}
            isMobileMenuOpen={isMobileMenuOpen}
          />
          <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
