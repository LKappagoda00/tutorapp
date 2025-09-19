import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import StudentRegister from './pagers/StudentRegister.jsx';
import TeacherRegister from './pagers/TeacherRegister.jsx';

function Home() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-8 text-blue-700">Welcome to Tutor App</h1>
      <div className="space-x-4">
        <button
          className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
          onClick={() => navigate('/student-register')}
        >
          User Register
        </button>
        <button
          className="px-6 py-3 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
          onClick={() => navigate('/teacher-register')}
        >
          Teacher Register
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/student-register" element={<StudentRegister />} />
        <Route path="/teacher-register" element={<TeacherRegister />} />
      </Routes>
    </Router>
  );
}
