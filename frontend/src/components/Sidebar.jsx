import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  DollarSign,
  Users,
  BookOpen,
  BarChart2,
} from "lucide-react";

export default function Sidebar({ role }) {
  const navigate = useNavigate();

  let buttons = [];
  if (role === "admin") {
    buttons = [
      { label: "Salary", to: "/admin-salary", icon: DollarSign },
      { label: "Users", to: "/admin-users", icon: Users },
    ];
  } else if (role === "student") {
    buttons = [
    
      { label: "Mark Analysis", to: "/marks-analysis", icon: BarChart2 },
        { label: "profile", to: "/student-profile", icon: BookOpen },
      { label: "Payment", to: "/student-payment", icon: DollarSign },
      
    ];
  } else if (role === "teacher") {
    buttons = [
      { label: "View Salary", to: "/teacher-salary", icon: DollarSign },
      { label: "Marks", to: "/add-marks", icon: BookOpen },
    ];
  }

  return (
    <aside className="flex-col w-64 h-screen p-6 bg-white border-r shadow-lg flext rounded-r-2xl">
      {/* Logo / Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-800">
          Dashboard
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        {buttons.map((btn) => {
          const Icon = btn.icon;
          return (
            <button
              key={btn.label}
              onClick={() => navigate(btn.to)}
              className="flex items-center gap-3 px-4 py-3 text-gray-700 transition-all duration-300 ease-in-out rounded-xl hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white"
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{btn.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="pt-6 mt-auto border-t">
        <button
          onClick={() => navigate("/logout")}
          className="flex items-center w-full gap-3 px-4 py-3 text-red-600 transition hover:bg-red-50 rounded-xl"
        >
          {/* <Home className="w-5 h-5" /> */}
          {/* <span className="font-medium">Logout</span> */}
        </button>
      </div>
    </aside>
  );
}
