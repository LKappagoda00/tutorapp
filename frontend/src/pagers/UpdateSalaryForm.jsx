import React from 'react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import Sidebar from '../components/Sidebar.jsx';
import { useNavigate } from 'react-router-dom';

export default function UpdateSalaryForm() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200">
      <Header />
      <div className="flex flex-1">
        <Sidebar role="admin" />
        <main className="flex-1 flex flex-col items-center justify-center py-10">
          <div className="bg-white/90 rounded-2xl shadow-xl p-8 w-full max-w-2xl">
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-6 drop-shadow-lg text-center">Update Salary</h2>
            <form className="flex flex-col gap-6" onSubmit={e => { e.preventDefault(); navigate('/admin-salary'); }}>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Tutor Name</label>
                <input className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow" placeholder="Enter tutor name" />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Class ID</label>
                <input className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow" placeholder="e.g. CL001" />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Date</label>
                <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow" />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Amount</label>
                <input type="number" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow" placeholder="Enter amount" />
              </div>
              <button type="submit" className="w-full py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-extrabold rounded-xl shadow-lg hover:scale-105 transition-all text-lg tracking-wide">Update</button>
            </form>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
