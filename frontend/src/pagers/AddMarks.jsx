import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';

export default function AddMarks() {
  const navigate = useNavigate();
  // Dummy data for dropdowns
  const studentIds = ['STU001', 'STU002', 'STU003'];
  const examTypes = ['Term Test', 'Monthly Quiz', 'Final Exam'];
  const lessons = ['Algebra', 'Photosynthesis', 'World History'];
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200">
      <Header />
      <div className="flex-grow flex flex-row">
        <Sidebar role="admin" />
        <div className="flex-grow flex flex-col items-center justify-center py-8">
          <div className="bg-white/90 rounded-2xl shadow-xl p-8 w-full max-w-xl">
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-6 drop-shadow-lg text-center">Add Marks</h2>
            <form className="flex flex-col gap-6" onSubmit={e => { e.preventDefault(); navigate('/admin-marks'); }}>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Student ID</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow">
                  <option value="">Select Student ID</option>
                  {studentIds.map(id => (
                    <option key={id} value={id}>{id}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Exam Type</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow">
                  <option value="">Select Exam Type</option>
                  {examTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Lesson</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow">
                  <option value="">Select Lesson</option>
                  {lessons.map(lesson => (
                    <option key={lesson} value={lesson}>{lesson}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Marks</label>
                <input type="number" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow" placeholder="e.g. 85" />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Special Note</label>
                <input className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow" placeholder="e.g. Excellent improvement" />
              </div>
              <button type="submit" className="w-full py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-extrabold rounded-xl shadow-lg hover:scale-105 transition-all text-lg tracking-wide">Add Marks</button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
