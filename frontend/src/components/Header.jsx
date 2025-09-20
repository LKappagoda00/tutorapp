
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
    <header className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 py-4 shadow-lg">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-white tracking-wide drop-shadow-lg">CYBORG SPHERE</h1>
        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className="ml-4 px-5 py-2 bg-white text-purple-600 font-bold rounded-lg shadow hover:bg-purple-100 transition-all"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
}
