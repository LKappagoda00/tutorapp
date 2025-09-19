import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Hardcoded credentials
  const users = [
    { username: 'admin', password: 'admin123', role: 'admin' },
    { username: 'student', password: 'student123', role: 'student' },
    { username: 'teacher', password: 'teacher123', role: 'teacher' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = users.find(
      (u) => u.username === username && u.password === password
    );
    if (found) {
      setError('');
      if (found.role === 'admin') navigate('/admin-dashboard');
      else if (found.role === 'student') navigate('/student-dashboard');
      else if (found.role === 'teacher') navigate('/teacher-dashboard');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200">
      <div className="relative w-full max-w-md">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-blue-400 via-purple-400 to-pink-400 blur-2xl opacity-40 animate-pulse"></div>
        <div className="relative z-10 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-10 flex flex-col items-center animate-fade-in">
          <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-3 rounded-full shadow-lg mb-6 animate-bounce">
            <svg width="56" height="56" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5s-3 1.343-3 3 1.343 3 3 3zm0 2c-2.67 0-8 1.337-8 4v2a1 1 0 001 1h14a1 1 0 001-1v-2c0-2.663-5.33-4-8-4z"/></svg>
          </div>
          <div>
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-3 drop-shadow-lg">Tutor App</h1>
          <br/><br/>
          </div>
          <form className="flex flex-col gap-10 w-full" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-2 font-semibold text-gray-700" htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow"
                placeholder="Enter your username"
                autoComplete="username"
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold text-gray-700" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition shadow"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>
            {error && <div className="text-red-500 text-center font-semibold">{error}</div>}
            <button
              type="submit"
              className="w-full py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition-transform duration-200 text-lg tracking-wide"
            >
              Login
            </button>
          </form>
          <div className="flex justify-center mt-8 gap-4 w-full">
            <button
              className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition font-semibold w-1/2"
              onClick={() => navigate('/student-register')}
            >
              User Register
            </button>
            <button
              className="px-6 py-3 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition font-semibold w-1/2"
              onClick={() => navigate('/teacher-register')}
            >
              Teacher Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
