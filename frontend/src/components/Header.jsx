
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getStoredToken, clearAuthData } from '../utils/auth';

export default function Header() {
  const navigate = useNavigate();
  const isLoggedIn = !!getStoredToken();

  const handleLogout = () => {
    clearAuthData();
    navigate('/');
  };

  return (
    <header className="w-full py-4 shadow-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
      <div className="container flex items-center justify-between px-4 mx-auto">
        <h1 className="text-3xl font-extrabold tracking-wide text-white drop-shadow-lg">CYBORG SPHERE</h1>
        {!isLoggedIn && (
          <h2
            className="text-lg font-semibold text-white cursor-pointer"
            onClick={() => navigate('/login')}
          >
            Login
          </h2>
        )}
        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className="px-5 py-2 ml-4 font-bold text-purple-600 transition-all bg-white rounded-lg shadow hover:bg-purple-100"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
}
