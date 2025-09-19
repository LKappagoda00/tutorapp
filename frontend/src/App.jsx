import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pagers/Login.jsx';
import StudentRegister from './pagers/StudentRegister.jsx';
import TeacherRegister from './pagers/TeacherRegister.jsx';
import AdminDashboard from './pagers/AdminDashboard.jsx';
import StudentDashboard from './pagers/StudentDashboard.jsx';
import TeacherDashboard from './pagers/TeacherDashboard.jsx';

export default function App() {
  return (
    <Router>
      <Routes>
  <Route path="/" element={<Login />} />
  <Route path="/student-register" element={<StudentRegister />} />
  <Route path="/teacher-register" element={<TeacherRegister />} />
  <Route path="/admin-dashboard" element={<AdminDashboard />} />
  <Route path="/student-dashboard" element={<StudentDashboard />} />
  <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
      </Routes>
    </Router>
  );
}
