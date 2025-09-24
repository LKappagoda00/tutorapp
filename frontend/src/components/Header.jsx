
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getStoredToken, getStoredUser, clearAuthData } from '../utils/auth';

export default function Header() {
  const navigate = useNavigate();
  const isLoggedIn = !!getStoredToken();
  const user = getStoredUser();

  const handleLogout = () => {
    clearAuthData();
    navigate('/');
  };

  const handleTitleClick = () => {
    if (!isLoggedIn || !user) {
      navigate('/');
      return;
    }

    // Navigate based on user role
    switch (user.role) {
      case 'admin':
        navigate('/admin-dashboard');
        break;
      case 'teacher':
        navigate('/teacher-dashboard');
        break;
      case 'student':
        navigate('/student-dashboard');
        break;
      default:
        navigate('/');
        break;
    }
  };

  return (
    <header className="w-full py-4 shadow-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
      <div className="container flex items-center justify-between px-4 mx-auto">
        <h1 
          className="text-3xl font-extrabold tracking-wide text-white drop-shadow-lg cursor-pointer hover:text-gray-200 transition-colors duration-200"
          onClick={handleTitleClick}
          title={isLoggedIn ? `Go to ${user?.role || 'user'} dashboard` : 'Go to home page'}
        >
          CYBORG SPHERE
        </h1>
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
