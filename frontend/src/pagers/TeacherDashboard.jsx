import React from 'react';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';

export default function TeacherDashboard() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200">
      <Header />
      <div className="flex-grow flex flex-row">
        <Sidebar role="teacher" />
        <div className="flex-grow flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-10 flex flex-col items-center animate-fade-in">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-6 drop-shadow-lg">Teacher Dashboard</h1>
            <p className="text-lg text-gray-700">Welcome, Teacher!</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
