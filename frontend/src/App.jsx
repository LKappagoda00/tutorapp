import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pagers/Login.jsx";
import StudentRegister from "./pagers/student/StudentRegister.jsx";
import TeacherRegister from "./pagers/teacher/TeacherRegister.jsx";

import AdminDashboard from "./pagers/admin/AdminDashboard.jsx";
import StudentDashboard from "./pagers/student/StudentDashboard.jsx";
import TeacherDashboard from "./pagers/teacher/TeacherDashboard.jsx";
import AdminSalary from "./pagers/admin/AdminSalary.jsx";

import AdminMarks from "./pagers/AdminMarks.jsx";
import TeacherViewSalary from "./pagers/teacher/TeacherViewSalary.jsx";
import UpdateMarks from "./pagers/UpdateMarks.jsx";
import UpdateSalaryForm from "./pagers/admin/UpdateSalaryForm.jsx";
import CreateSalaryForm from "./pagers/CreateSalaryForm.jsx";

import AddMarks from "./pagers/AddMarks.jsx";

import UpdateUser from "./pagers/admin/UpdateUser.jsx";
import AdminUsers from "./pagers/admin/AdminUsers.jsx";
import StudentMakePayment from "./pagers/student/StudentMakePayment.jsx";
import Home from "./pagers/Home.jsx";
import StudentMarks from "./pagers/student/StudentMarks.jsx";
import MarksAnalysis from "./pagers/student/MarksAnalysis.jsx";
import StudentProfile from "./pagers/student/studentprofile.jsx";
import Library from "./pagers/library/libraryDashboad.jsx";
import LibraryAdmin from "./pagers/library/AdminDashboard.jsx";
import UploadResource from "./pagers/library/UploadResource.jsx";
import LibraryChatbot from "./pagers/library/Chatbot.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import SessionDetails from "./ScheduleComponents/SessionDetails/SessionDetails.jsx"; 
import DisplaySession from "./ScheduleComponents/SessionDisplay/SessionDisplay.jsx";
import AddSession from "./ScheduleComponents/AddSession/AddSession.jsx";
import UpdateSession from './ScheduleComponents/UpdateSession/UpdateSession.jsx';
import InstructorsPage from './ScheduleComponents/AddSession/InstructorsPage.jsx';


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/student-register" element={<StudentRegister />} />
        <Route path="/teacher-register" element={<TeacherRegister />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/admin-salary" element={<AdminSalary />} />
        <Route path="/admin-users" element={<AdminUsers />} />
        <Route path="/admin-marks" element={<AdminMarks />} />
        <Route path="/student-payment" element={<StudentMakePayment />} />
        <Route path="/teacher-salary" element={<TeacherViewSalary />} />
        <Route path="/create-salary" element={<CreateSalaryForm />} />
        <Route path="/update-salary/:id" element={<UpdateSalaryForm />} />
        <Route path="/add-marks" element={<AddMarks />} />
        <Route path="/update-marks/:id" element={<UpdateMarks />} />
        <Route path="/update-user/:id" element={<UpdateUser />} />
        <Route path="/student-marks" element={<StudentMarks />} />
        <Route path="/marks-analysis" element={<MarksAnalysis />} />
        <Route path="/student-profile" element={<StudentProfile />} />
        <Route path="/library" element={<Library />} />
        <Route path="/library-admin" element={<LibraryAdmin />} />
        <Route path="/upload-resource" element={<UploadResource />} />
        <Route path="/library-chat" element={<LibraryChatbot />} />
        <Route path="/sessions" element={<SessionDetails />} />
        <Route path="/session/:id" element={<DisplaySession />} /> 
        <Route path="/add-session" element={<AddSession />} />
        <Route path="/update-session/:id" element={<UpdateSession />} />
        <Route path="/instructors" element={<InstructorsPage />} />
      </Routes>
      <ToastContainer position="top-right" />
    </Router>
  );
}
