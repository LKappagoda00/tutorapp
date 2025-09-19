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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can add validation here
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200">
      <div className="relative w-full max-w-lg">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-blue-400 via-purple-400 to-pink-400 blur-2xl opacity-40 animate-pulse"></div>
        <div className="relative z-10 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-10 flex flex-col items-center animate-fade-in">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-6 drop-shadow-lg">Student Register</h2>
          <form className="flex flex-col gap-5 w-full" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-2 font-semibold text-gray-700" htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={form.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow"
                placeholder="Enter your full name"
                required
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold text-gray-700" htmlFor="userName">User Name</label>
              <input
                id="userName"
                name="userName"
                type="text"
                value={form.userName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow"
                placeholder="Enter your user name"
                required
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold text-gray-700" htmlFor="dob">Date of Birth</label>
              <input
                id="dob"
                name="dob"
                type="date"
                value={form.dob}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow"
                required
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold text-gray-700" htmlFor="address">Address</label>
              <input
                id="address"
                name="address"
                type="text"
                value={form.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow"
                placeholder="Enter your address"
                required
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold text-gray-700" htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow"
                placeholder="Enter your phone number"
                required
              />
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
                    className="form-radio text-blue-500"
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
                    className="form-radio text-pink-500"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition shadow"
                placeholder="Enter your password"
                required
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold text-gray-700" htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition shadow"
                placeholder="Confirm your password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition-transform duration-200 text-lg tracking-wide mt-2"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
