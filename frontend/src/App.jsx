import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pagers/Login.jsx';
import StudentRegister from './pagers/student/StudentRegister.jsx';
import TeacherRegister from './pagers/teacher/TeacherRegister.jsx';

import AdminDashboard from './pagers/AdminDashboard.jsx';
import StudentDashboard from './pagers/StudentDashboard.jsx';
import TeacherDashboard from './pagers/TeacherDashboard.jsx';
import AdminSalary from './pagers/AdminSalary.jsx';

import AdminMarks from './pagers/AdminMarks.jsx';
import StudentViewMarks from './pagers/StudentViewMarks.jsx';
import TeacherViewSalary from './pagers/TeacherViewSalary.jsx';
import UpdateMarks from './pagers/UpdateMarks.jsx'; 
import UpdateSalaryForm from './pagers/UpdateSalaryForm.jsx';
import CreateSalaryForm from './pagers/CreateSalaryForm.jsx';

import AddMarks from './pagers/AddMarks.jsx';

import UpdateUser from './pagers/admin/UpdateUser.jsx';
import AdminUsers from './pagers/admin/AdminUsers.jsx';

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
        <Route path="/admin-salary" element={<AdminSalary />} />
        <Route path="/admin-users" element={<AdminUsers />} />
        <Route path="/admin-marks" element={<AdminMarks />} />
        <Route path="/student-marks" element={<StudentViewMarks />} />
  <Route path="/teacher-salary" element={<TeacherViewSalary />} />
  <Route path="/create-salary" element={<CreateSalaryForm />} />
  <Route path="/update-salary" element={<UpdateSalaryForm />} />
  <Route path="/add-marks" element={<AddMarks />} />
  <Route path="/update-marks" element={<UpdateMarks />} />
  <Route path="/update-user/:id" element={<UpdateUser />} />
      </Routes>
    </Router>
  );
}
