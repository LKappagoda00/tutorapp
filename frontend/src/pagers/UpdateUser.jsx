import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';

export default function UpdateUser() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200">
      <Header />
      <div className="flex-grow flex flex-row">
        <Sidebar role="admin" />
        <div className="flex-grow flex flex-col items-center justify-center py-8">
          <div className="bg-white/90 rounded-2xl shadow-xl p-8 w-full max-w-xl">
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-6 drop-shadow-lg text-center">Update User</h2>
            <form className="flex flex-col gap-6" onSubmit={e => { e.preventDefault(); navigate('/admin-users'); }}>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Full Name</label>
                <input className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow" placeholder="e.g. Nimal Fernando" />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Date of Birth</label>
                <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow" />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Address</label>
                <input className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow" placeholder="e.g. 123 Main St, Colombo" />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Phone Number</label>
                <input className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow" placeholder="e.g. 0711234567" />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Role</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow">
                  <option value="">Select Role</option>
                  <option value="Student">Student</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <button type="submit" className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-extrabold rounded-xl shadow-lg hover:scale-105 transition-all text-lg tracking-wide">Update User</button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
