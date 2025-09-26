import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  DollarSign,
  Users,
  BookOpen,
  BarChart2,
  Library,
  LogOut,
  ChevronRight,
  Sparkles,
  Settings,
  UserCircle,
} from "lucide-react";

export default function Sidebar({ role }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  let buttons = [];
  if (role === "admin") {
    buttons = [
      { label: "Dashboard", to: "/admin-dashboard", icon: Home, gradient: "from-blue-500 to-indigo-600" },
      { label: "Salary Management", to: "/admin-salary", icon: DollarSign, gradient: "from-green-500 to-emerald-600" },
      { label: "User Management", to: "/admin-users", icon: Users, gradient: "from-purple-500 to-violet-600" },
      { label: "Library System", to: "/library-admin", icon: Library, gradient: "from-orange-500 to-amber-600" },
      { label: "Sessions", to: "/sessions", icon: BookOpen, gradient: "from-pink-500 to-rose-600" },
    ];
  } else if (role === "student") {
    buttons = [
      { label: "Dashboard", to: "/student-dashboard", icon: Home, gradient: "from-blue-500 to-indigo-600" },
      { label: "Mark Analysis", to: "/marks-analysis", icon: BarChart2, gradient: "from-cyan-500 to-teal-600" },
      { label: "Profile", to: "/student-profile", icon: UserCircle, gradient: "from-purple-500 to-violet-600" },
      { label: "Payments", to: "/student-payment", icon: DollarSign, gradient: "from-green-500 to-emerald-600" },
      { label: "Book Session", to: "/instructors", icon: Users, gradient: "from-pink-500 to-rose-600" },
      { label: "Library", to: "/library", icon: Library, gradient: "from-orange-500 to-amber-600" },
    ];
  } else if (role === "teacher") {
    buttons = [
      { label: "Dashboard", to: "/teacher-dashboard", icon: Home, gradient: "from-blue-500 to-indigo-600" },
      { label: "Salary Overview", to: "/teacher-salary", icon: DollarSign, gradient: "from-green-500 to-emerald-600" },
      { label: "Manage Marks", to: "/add-marks", icon: BookOpen, gradient: "from-purple-500 to-violet-600" },
      { label: "Library", to: "/upload-resource", icon: Library, gradient: "from-orange-500 to-amber-600" },

    ];
  }

  const getRoleInfo = () => {
    const roleConfig = {
      admin: {
        title: "Admin Panel",
        subtitle: "System Management",
        avatar: "👑",
        bgGradient: "from-blue-600 via-purple-600 to-blue-800",
        accentColor: "from-yellow-400 to-orange-500"
      },
      student: {
        title: "Student Portal",
        subtitle: "Learning Hub",
        avatar: "🎓",
        bgGradient: "from-emerald-500 via-teal-600 to-cyan-600",
        accentColor: "from-pink-400 to-rose-500"
      },
      teacher: {
        title: "Teacher Dashboard",
        subtitle: "Education Center",
        avatar: "👨‍🏫",
        bgGradient: "from-violet-500 via-purple-600 to-indigo-600",
        accentColor: "from-amber-400 to-orange-500"
      }
    };
    return roleConfig[role] || roleConfig.student;
  };

  const roleInfo = getRoleInfo();

  return (
    <aside className={`flex flex-col min-h-0 flex-shrink-0 transition-all duration-500 ease-in-out transform ${
      isCollapsed ? 'w-16' : 'w-64'
    } bg-gradient-to-br ${roleInfo.bgGradient} shadow-2xl backdrop-blur-xl border-r border-white/20 self-stretch`}>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-bounce"></div>
        <div className="absolute bottom-20 right-5 w-24 h-24 bg-gradient-to-r from-white/10 to-transparent rounded-full blur-xl animate-ping"></div>
      </div>

      {/* Header Section */}
      <div className="relative p-4 pb-3">
        <div className="flex items-center justify-between mb-4">
          <div className={`transition-all duration-500 ${isCollapsed ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}>
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 bg-gradient-to-r ${roleInfo.accentColor} rounded-lg flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-all duration-300`}>
                <Sparkles className="w-4 h-4 text-white animate-pulse" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white tracking-tight">
                  {roleInfo.title}
                </h1>
                <p className="text-white/70 text-xs font-medium">
                  {roleInfo.subtitle}
                </p>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 group border border-white/20"
          >
            <ChevronRight 
              className={`w-5 h-5 text-white transition-transform duration-300 ${
                isCollapsed ? 'rotate-0' : 'rotate-180'
              } group-hover:scale-110`} 
            />
          </button>
        </div>

        {/* User Profile Section */}
        <div className={`bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 transition-all duration-500 ${
          isCollapsed ? 'scale-0 opacity-0 h-0' : 'scale-100 opacity-100'
        }`}>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-white/20 to-white/10 rounded-lg flex items-center justify-center text-lg shadow-inner">
              {roleInfo.avatar}
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold text-xs">Welcome back!</p>
              <p className="text-white/60 text-xs capitalize">{role} Dashboard</p>
            </div>
            <div className="w-2 h-2 bg-green-400 rounded-full shadow-lg animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Navigation Section */}
      <nav className={`flex-1 overflow-y-auto px-3 pb-3 space-y-1 transition-all duration-300 ${isCollapsed ? 'px-1' : 'px-4'}`}>
        <div className={`transition-all duration-500 ${isCollapsed ? 'opacity-0 scale-0 h-0' : 'opacity-100 scale-100 mb-3'}`}>
          <h3 className="text-white/60 text-xs font-bold uppercase tracking-wider mb-2 px-2">
            Navigation
          </h3>
        </div>
        {buttons.map((btn, index) => {
          const Icon = btn.icon;
          const isActive = location.pathname === btn.to;
          const isHovered = hoveredItem === index;
          
          return (
            <div
              key={btn.label}
              className="relative group"
              onMouseEnter={() => setHoveredItem(index)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <button
                onClick={() => navigate(btn.to)}
                className={`
                  relative w-full flex items-center transition-all duration-500 ease-out transform
                  ${isCollapsed ? 'justify-center p-3' : 'justify-start px-4 py-3.5 space-x-4'}
                  ${isActive 
                    ? 'bg-white/20 shadow-xl scale-105 translate-x-2' 
                    : 'hover:bg-white/10 hover:scale-105 hover:translate-x-1'
                  }
                  rounded-2xl backdrop-blur-sm border border-white/10
                  group-hover:shadow-2xl group-hover:border-white/30
                `}
              >
                {/* Icon Container */}
                <div className={`
                  relative flex items-center justify-center transition-all duration-300
                  ${isActive ? 'scale-110' : 'group-hover:scale-110'}
                  ${isCollapsed ? 'w-6 h-6' : 'w-8 h-8'}
                `}>
                  <div className={`
                    absolute inset-0 bg-gradient-to-r ${btn.gradient} rounded-lg opacity-20
                    ${isActive ? 'opacity-40' : 'group-hover:opacity-30'}
                    transition-opacity duration-300
                  `}></div>
                  <Icon className={`
                    relative z-10 text-white transition-all duration-300
                    ${isCollapsed ? 'w-4 h-4' : 'w-5 h-5'}
                    ${isActive ? 'drop-shadow-lg' : 'group-hover:drop-shadow-md'}
                  `} />
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute -right-1 -top-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg animate-pulse"></div>
                  )}
                </div>

                {/* Label */}
                {!isCollapsed && (
                  <span className={`
                    font-semibold transition-all duration-300 text-left text-sm
                    ${isActive ? 'text-white' : 'text-white/90 group-hover:text-white'}
                  `}>
                    {btn.label}
                  </span>
                )}

                {/* Arrow indicator */}
                {!isCollapsed && (
                  <ChevronRight className={`
                    ml-auto w-4 h-4 text-white/50 transition-all duration-300
                    ${isActive ? 'text-white translate-x-1' : 'group-hover:text-white/80 group-hover:translate-x-1'}
                  `} />
                )}

                {/* Hover effect overlay */}
                <div className={`
                  absolute inset-0 bg-gradient-to-r ${btn.gradient} rounded-2xl opacity-0
                  group-hover:opacity-10 transition-opacity duration-300
                `}></div>
              </button>

              {/* Tooltip for collapsed state */}
              {isCollapsed && isHovered && (
                <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-4 z-50">
                  <div className="bg-gray-900/95 backdrop-blur-sm text-white px-4 py-2 rounded-xl shadow-2xl border border-white/20 whitespace-nowrap">
                    <span className="text-sm font-semibold">{btn.label}</span>
                    <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900/95"></div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Settings & Logout Footer */}
      <div className={`mt-auto p-3 space-y-2 border-t border-white/20 bg-black/10 backdrop-blur-sm transition-all duration-300 ${isCollapsed ? 'px-1' : 'px-4'}`}>
        {/* Settings Button */}
        <button
          onClick={() => navigate("/settings")}
          className={`
            relative w-full flex items-center transition-all duration-300 ease-out
            ${isCollapsed ? 'justify-center p-3' : 'justify-start px-4 py-3 space-x-3'}
            hover:bg-white/10 rounded-xl backdrop-blur-sm border border-white/10
            group hover:scale-105 hover:shadow-lg
          `}
        >
          <Settings className={`text-white/70 group-hover:text-white transition-colors duration-300 ${
            isCollapsed ? 'w-5 h-5' : 'w-5 h-5'
          }`} />
          {!isCollapsed && (
            <span className="text-white/70 group-hover:text-white font-medium transition-colors duration-300">
              Settings
            </span>
          )}
        </button>

        {/* Logout Button */}
        <button
          onClick={() => {
            localStorage.removeItem('token');
            navigate("/login");
          }}
          className={`
            relative w-full flex items-center transition-all duration-300 ease-out
            ${isCollapsed ? 'justify-center p-3' : 'justify-start px-4 py-3 space-x-3'}
            hover:bg-red-500/20 rounded-xl backdrop-blur-sm border border-red-500/20
            group hover:scale-105 hover:shadow-lg hover:border-red-500/40
          `}
        >
          <LogOut className={`text-red-300 group-hover:text-red-200 transition-colors duration-300 ${
            isCollapsed ? 'w-5 h-5' : 'w-5 h-5'
          }`} />
          {!isCollapsed && (
            <span className="text-red-300 group-hover:text-red-200 font-medium transition-colors duration-300">
              Logout
            </span>
          )}
        </button>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
    </aside>
  );
}
