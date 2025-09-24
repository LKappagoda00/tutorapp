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
      { label: "Payment", to: "/student-payment", icon: DollarSign },
      { label: "Mark Analysis", to: "/marks-analysis", icon: BarChart2 },
    ];
  } else if (role === "teacher") {
    buttons = [
      { label: "View Salary", to: "/teacher-salary", icon: DollarSign },
      { label: "Marks", to: "/add-marks", icon: BookOpen },
    ];
  }

  return (
    <aside className="flex flex-col w-64 h-screen bg-white shadow-lg border-r rounded-r-2xl p-6">
      {/* Logo / Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
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
              className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-xl hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white transition-all duration-300 ease-in-out"
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{btn.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-6 border-t">
        <button
          onClick={() => navigate("/logout")}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition"
        >
          <Home className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
