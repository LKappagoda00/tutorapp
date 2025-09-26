import { Link, useLocation } from "react-router-dom";
import { useState } from "react";


const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: "/library", label: "Library", icon: "📚" },
    { path: "/upload-resource", label: "Upload", icon: "⬆️" },
    
  ];

  return (
    <>
      <nav className="bg-slate-800 shadow-2xl border-b border-blue-300/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <Link 
                to="/" 
                className="flex items-center space-x-3 group"
              >
                <div className="bg-sky-500/20 p-2 rounded-xl group-hover:bg-sky-500/30 transition-all duration-300">
                  <span className="text-2xl">📚</span>
                </div>
                <div>
                  <h1 className="font-bold text-xl bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    Library System
                  </h1>
                  <p className="text-blue-200/70 text-xs">Knowledge Hub</p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                    location.pathname === item.path || 
                    (item.path === "/library" && location.pathname === "/")
                      ? "bg-blue-600 shadow-lg text-white"
                      : "text-blue-100 hover:bg-blue-500/20 hover:text-white"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-blue-100 hover:text-white p-2 rounded-lg hover:bg-blue-500/20 transition-colors duration-200"
                aria-label="Toggle menu"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-blue-900/50 backdrop-blur-sm border-t border-blue-300/20">
            <div className="px-4 pt-2 pb-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    location.pathname === item.path || 
                    (item.path === "/library" && location.pathname === "/")
                      ? "bg-blue-600 text-white shadow-inner"
                      : "text-blue-100 hover:bg-blue-500/20 hover:text-white"
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;