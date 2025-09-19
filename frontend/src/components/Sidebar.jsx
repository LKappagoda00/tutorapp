import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Sidebar({ role }) {
  const navigate = useNavigate();

  // Determine button count for flex-grow
  let buttons = [];
  if (role === 'admin') {
    buttons = [
      { label: 'Salary', to: '/admin-salary' },
      { label: 'Marks', to: '/admin-marks' },
      { label: 'Users', to: '/admin-users' },
    ];
  } else if (role === 'student') {
    buttons = [
      { label: 'View Marks', to: '/student-marks' },
    ];
  } else if (role === 'teacher') {
    buttons = [
      { label: 'View Salary', to: '/teacher-salary' },
    ];
  }

  return (
    <aside className="w-56 min-h-full bg-white/80 shadow-xl rounded-3xl p-6 flex flex-col gap-6 mt-8 ml-4">
      <nav className="flex flex-col gap-4 h-full flex-1">
        {buttons.map((btn, idx) => (
          <button
            key={btn.label}
            onClick={() => navigate(btn.to)}
            className="sidebar-btn wow-btn flex-1 min-h-0"
            style={{ minHeight: 0 }}
          >
            {btn.label}
          </button>
        ))}
      </nav>
      <style>{`
        .sidebar-btn {
          @apply w-full h-full py-3 px-6 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-extrabold shadow-xl text-lg tracking-wide relative overflow-hidden transition-all duration-300 flex items-center justify-center;
        }
        .wow-btn {
          box-shadow: 0 4px 24px 0 rgba(99,102,241,0.25), 0 1.5px 8px 0 rgba(232,121,249,0.15);
          border: none;
          position: relative;
          z-index: 1;
        }
        .wow-btn:before {
          content: '';
          position: absolute;
          left: 0; top: 0; right: 0; bottom: 0;
          background: linear-gradient(120deg, #60a5fa 0%, #a78bfa 50%, #f472b6 100%);
          opacity: 0.25;
          filter: blur(12px);
          z-index: -1;
          transition: opacity 0.3s;
        }
        .wow-btn:hover {
          transform: scale(1.08) rotate(-1deg);
          box-shadow: 0 8px 32px 0 rgba(99,102,241,0.35), 0 3px 16px 0 rgba(232,121,249,0.25);
        }
        .wow-btn:hover:before {
          opacity: 0.5;
        }
      `}</style>
    </aside>
  );
}
