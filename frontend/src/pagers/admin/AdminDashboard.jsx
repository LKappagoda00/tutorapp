import React from 'react';

import Header from '../../components/Header';
import Footer from '../../components/Footer';

import Sidebar from '../../components/Sidebar';
import DummyInstituteData from '../../components/DummyInstituteData';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200">
      <Header />
      <div className="flex-grow flex flex-row">
        <Sidebar role="admin" />
        <div className="flex-grow flex flex-col items-center justify-start py-8 overflow-y-auto">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-10 flex flex-col items-center animate-fade-in w-full max-w-5xl">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-6 drop-shadow-lg">Admin Dashboard</h1>
            <p className="text-lg text-gray-700 mb-8">Welcome, Admin!</p>
            <DummyInstituteData />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
