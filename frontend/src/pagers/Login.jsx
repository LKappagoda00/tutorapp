import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStoredToken, clearAuthData } from '../utils/auth';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check for existing valid token on mount
  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const userRole = userData.role;
      
      if (userRole === "admin") {
        navigate("/admin-dashboard");
      } else if (userRole === "student") {
        navigate("/student-marks");
      } else if (userRole === "teacher") {
        navigate("/teacher-dashboard");
      } else if (userRole === "library") {
        navigate("/library");
      }
    } else {
      clearAuthData(); // Clear any invalid data
    }
  }, [navigate]);

  // Authenticate with backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    // Enhanced validation
    if (!username.trim()) {
      setError("Username is required");
      return;
    }
    
    if (!password.trim()) {
      setError("Password is required");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Backend returns { message, token, user }
        // Store token and user data for session management
        const { token, user } = data;
        
        // Store token with expiry (24 hours from now)
        const tokenData = {
          value: token,
          expiry: new Date().getTime() + (24 * 60 * 60 * 1000)  // 24 hours from now
        };
        localStorage.setItem('token', JSON.stringify(tokenData));
        
        // Store minimal user data
        const userData = {
          id: user._id,
          role: user.role,
          username: user.userName || user.nic
        };
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Navigate based on user role
        const userRole = user.role;
        if (userRole === "admin") {
          navigate("/admin-dashboard");
        } else if (userRole === "student") {
          navigate("/student-marks");
        } else if (userRole === "teacher") {
          navigate("/teacher-dashboard");
        } else if (userRole === "library") {
          navigate("/library");
        } else {
          navigate("/"); // fallback
        }

      } else {
        // Backend returns { error } for failed authentication
        setError(data.error || "Invalid username or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Network error. Please check if the server is running and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200">
      <div className="relative w-full max-w-md">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-blue-400 via-purple-400 to-pink-400 blur-2xl opacity-40 animate-pulse"></div>
        <div className="relative z-10 flex flex-col items-center p-10 shadow-2xl bg-white/90 backdrop-blur-xl rounded-3xl animate-fade-in">
          <div className="p-3 mb-6 rounded-full shadow-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-bounce">
            <svg width="56" height="56" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5s-3 1.343-3 3 1.343 3 3 3zm0 2c-2.67 0-8 1.337-8 4v2a1 1 0 001 1h14a1 1 0 001-1v-2c0-2.663-5.33-4-8-4z"/></svg>
          </div>
          <div>
          <h1 className="mb-3 text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 drop-shadow-lg">Tutor App</h1>
          <br/><br/>
          </div>
          <form className="flex flex-col w-full gap-10" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-2 font-semibold text-gray-700" htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-4 py-2 transition border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                className="w-full px-4 py-2 transition border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-pink-400"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>
            {error && (
              <div className="p-3 text-red-700 bg-red-100 border border-red-400 rounded-lg">
                <p className="text-center">{error}</p>
              </div>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition-transform duration-200 text-lg tracking-wide ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>

            <div className="flex justify-center w-full gap-4 mt-6">
              <button
                type="button"
                className="w-1/2 px-6 py-3 font-semibold text-white transition bg-blue-500 rounded-lg shadow hover:bg-blue-600"
                onClick={() => navigate('/student-register')}
              >
                Student Register
              </button>
              <button
                type="button"
                className="w-1/2 px-6 py-3 font-semibold text-white transition bg-green-500 rounded-lg shadow hover:bg-green-600"
                onClick={() => navigate('/teacher-register')}
              >
                Teacher Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
