import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


export default function StudentRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    userName: '',
    dob: '',
    address: '',
    phone: '',
    isClassStudent: 'no',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    // If editing fullName, strip any digits immediately
    if (name === 'fullName') {
      const sanitized = value.replace(/[0-9]/g, '');
      setForm((prev) => ({ ...prev, [name]: sanitized }));
    } else if (name === 'phone') {
      // Keep only digits for phone
      const digits = value.replace(/[^0-9]/g, '');
      setForm((prev) => ({ ...prev, [name]: digits }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    const errors = {};
    
    // Full Name validation
    const trimmedName = form.fullName.trim();
    if (!trimmedName || trimmedName.length < 2) {
      errors.fullName = 'Full name must be at least 2 characters';
    } else if (/\d/.test(form.fullName)) {
      errors.fullName = 'Full name cannot include numbers';
    }
    
    // User Name validation
    if (!form.userName.trim() || form.userName.trim().length < 3) {
      errors.userName = 'Username must be at least 3 characters';
    }
    
    // Date of Birth validation
    if (!form.dob) {
      errors.dob = 'Date of birth is required';
    } else {
      const today = new Date();
      const dobDate = new Date(form.dob);
      if (dobDate > today) {
        errors.dob = 'Date of birth cannot be in the future';
      }
      // Check if age is reasonable (e.g., at least 5 years old)
      const age = today.getFullYear() - dobDate.getFullYear();
      if (age < 5) {
        errors.dob = 'Student must be at least 5 years old';
      }
    }

    // Address validation
    if (!form.address.trim() || form.address.trim().length < 5) {
      errors.address = 'Address must be at least 5 characters';
    }
    
    // Phone validation
    const phoneDigits = (form.phone || '').replace(/[^0-9]/g, '');
    if (!phoneDigits) {
      errors.phone = 'Phone number is required';
    } else if (!/^\d{10,}$/.test(phoneDigits)) {
      errors.phone = 'Phone number must contain at least 10 digits';
    } else if (phoneDigits !== form.phone) {
      // If non-digit characters were present (should be sanitized on change), show error
      errors.phone = 'Phone number must contain only digits';
    }
    
    // Password validation
    if (!form.password) {
      errors.password = 'Password is required';
    } else if (form.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    // Confirm Password validation
    if (!form.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (form.password !== form.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFieldErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      setLoading(false);
      return;
    }

    // Basic validation (keeping existing for backward compatibility)
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    // Prepare data for API
    const payload = {
      fullName: form.fullName,
      userName: form.userName,
      dob: form.dob,
      address: form.address,
      phone: form.phone,
      isClassStudent: form.isClassStudent,
      password: form.password,
      confirmPassword: form.confirmPassword,
      role: 'student',
    };

    try {
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok) {
        navigate('/login'); // Go to login page
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200">
      <div className="relative w-full max-w-lg">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-blue-400 via-purple-400 to-pink-400 blur-2xl opacity-40 animate-pulse"></div>
        <div className="relative z-10 flex flex-col items-center p-10 shadow-2xl bg-white/90 backdrop-blur-xl rounded-3xl animate-fade-in">
          <h2 className="mb-6 text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 drop-shadow-lg">Student Register</h2>
          <form className="flex flex-col w-full gap-5" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 mb-2 text-center text-red-700 bg-red-100 border border-red-400 rounded-lg">
                {error}
              </div>
            )}
            <div>
              <label className="block mb-2 font-semibold text-gray-700" htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={form.fullName}
                onChange={handleChange}
                onPaste={(e) => {
                  // Prevent pasted content with digits; sanitize and append
                  const paste = (e.clipboardData || window.clipboardData).getData('text');
                  if (/\d/.test(paste)) {
                    e.preventDefault();
                    const sanitized = paste.replace(/\d/g, '');
                    // Append sanitized paste at cursor position if possible
                    const el = e.target;
                    const start = el.selectionStart || 0;
                    const end = el.selectionEnd || 0;
                    const newVal = (form.fullName || '').slice(0, start) + sanitized + (form.fullName || '').slice(end);
                    setForm(prev => ({ ...prev, fullName: newVal }));
                  }
                }}
                 className={`w-full px-4 py-2 transition border rounded-lg shadow focus:outline-none focus:ring-2 ${
                   fieldErrors.fullName 
                     ? 'border-red-500 focus:ring-red-400' 
                     : 'border-gray-300 focus:ring-blue-400'
                 }`}
                 placeholder="Enter your full name"
                 required
               />
              {fieldErrors.fullName && (
                <p className="mt-1 text-sm text-red-500">{fieldErrors.fullName}</p>
              )}
            </div>
            <div>
              <label className="block mb-2 font-semibold text-gray-700" htmlFor="userName">User Name</label>
              <input
                id="userName"
                name="userName"
                type="text"
                value={form.userName}
                onChange={handleChange}
                className={`w-full px-4 py-2 transition border rounded-lg shadow focus:outline-none focus:ring-2 ${
                  fieldErrors.userName 
                    ? 'border-red-500 focus:ring-red-400' 
                    : 'border-gray-300 focus:ring-blue-400'
                }`}
                placeholder="Enter your user name"
                required
              />
              {fieldErrors.userName && (
                <p className="mt-1 text-sm text-red-500">{fieldErrors.userName}</p>
              )}
            </div>
            <div>
              <label className="block mb-2 font-semibold text-gray-700" htmlFor="dob">Date of Birth</label>
              <input
                id="dob"
                name="dob"
                type="date"
                value={form.dob}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
                className={`w-full px-4 py-2 transition border rounded-lg shadow focus:outline-none focus:ring-2 ${
                  fieldErrors.dob 
                    ? 'border-red-500 focus:ring-red-400' 
                    : 'border-gray-300 focus:ring-blue-400'
                }`}
                required
              />
              {fieldErrors.dob && (
                <p className="mt-1 text-sm text-red-500">{fieldErrors.dob}</p>
              )}
            </div>
            <div>
              <label className="block mb-2 font-semibold text-gray-700" htmlFor="address">Address</label>
              <input
                id="address"
                name="address"
                type="text"
                value={form.address}
                onChange={handleChange}
                className={`w-full px-4 py-2 transition border rounded-lg shadow focus:outline-none focus:ring-2 ${
                  fieldErrors.address 
                    ? 'border-red-500 focus:ring-red-400' 
                    : 'border-gray-300 focus:ring-blue-400'
                }`}
                placeholder="Enter your address"
                required
              />
              {fieldErrors.address && (
                <p className="mt-1 text-sm text-red-500">{fieldErrors.address}</p>
              )}
            </div>
            <div>
              <label className="block mb-2 font-semibold text-gray-700" htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                inputMode="numeric"
                pattern="[0-9]*"
                onPaste={(e) => {
                  const paste = (e.clipboardData || window.clipboardData).getData('text');
                  const digits = paste.replace(/[^0-9]/g, '');
                  if (digits !== paste) {
                    e.preventDefault();
                    // Insert sanitized digits
                    setForm(prev => ({ ...prev, phone: (prev.phone || '') + digits }));
                  }
                }}
                className={`w-full px-4 py-2 transition border rounded-lg shadow focus:outline-none focus:ring-2 ${
                  fieldErrors.phone 
                    ? 'border-red-500 focus:ring-red-400' 
                    : 'border-gray-300 focus:ring-blue-400'
                }`}
                placeholder="Enter your phone number"
                required
              />
              {fieldErrors.phone && (
                <p className="mt-1 text-sm text-red-500">{fieldErrors.phone}</p>
              )}
            </div>
            <div>
              <label className="block mb-2 font-semibold text-gray-700">Class Student?</label>
              <div className="flex gap-6">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="isClassStudent"
                    value="yes"
                    checked={form.isClassStudent === 'yes'}
                    onChange={handleChange}
                    className="text-blue-500 form-radio"
                  />
                  <span className="ml-2">Yes</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="isClassStudent"
                    value="no"
                    checked={form.isClassStudent === 'no'}
                    onChange={handleChange}
                    className="text-pink-500 form-radio"
                  />
                  <span className="ml-2">No</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block mb-2 font-semibold text-gray-700" htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className={`w-full px-4 py-2 transition border rounded-lg shadow focus:outline-none focus:ring-2 ${
                  fieldErrors.password 
                    ? 'border-red-500 focus:ring-red-400' 
                    : 'border-gray-300 focus:ring-pink-400'
                }`}
                placeholder="Enter your password"
                required
              />
              {fieldErrors.password && (
                <p className="mt-1 text-sm text-red-500">{fieldErrors.password}</p>
              )}
            </div>
            <div>
              <label className="block mb-2 font-semibold text-gray-700" htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-2 transition border rounded-lg shadow focus:outline-none focus:ring-2 ${
                  fieldErrors.confirmPassword 
                    ? 'border-red-500 focus:ring-red-400' 
                    : 'border-gray-300 focus:ring-pink-400'
                }`}
                placeholder="Confirm your password"
                required
              />
              {fieldErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">{fieldErrors.confirmPassword}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition-transform duration-200 text-lg tracking-wide mt-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
