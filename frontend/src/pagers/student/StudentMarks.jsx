import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Sidebar from '../../components/Sidebar';
import StudentProfile from './studentprofile.jsx';

export default function StudentMarks() {
  const handleDownloadExcel = () => {
    const data = marks.map(m => ({
      Teacher: m.teacher?.fullName || 'N/A',
      Subject: m.teacher?.subject || 'N/A',
      ExamType: m.examType,
      Marks: m.marks,
      Date: m.date ? new Date(m.date).toLocaleDateString() : '',
      Note: m.specialNote || ''
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'MyMarks');
    XLSX.writeFile(workbook, 'my_marks_report.xlsx');
  };
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [loadingTeachers, setLoadingTeachers] = useState(true);

  // Get student id from localStorage
  const getStudentId = () => {
    try {
      const userRaw = localStorage.getItem('user');
      if (userRaw) {
        const userObj = JSON.parse(userRaw);
        return userObj.id || userObj._id || '';
      }
    } catch {}
    return '';
  };

  const studentId = getStudentId();

  // Fetch teachers list
  useEffect(() => {
    fetch('http://localhost:5000/api/users?role=teacher')
      .then(res => res.json())
      .then(data => {
        setTeachers(data);
        setLoadingTeachers(false);
      })
      .catch(() => {
        setLoadingTeachers(false);
      });
  }, []);

  // Fetch marks based on selected teacher
  useEffect(() => {
    if (!studentId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const url = selectedTeacher
      ? `http://localhost:5000/api/marks/teacher/${selectedTeacher}/student/${studentId}`
      : `http://localhost:5000/api/marks/student/${studentId}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setMarks(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching marks:', error);
        setLoading(false);
      });
  }, [studentId, selectedTeacher]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200">
      <Header />
      <div className="flex flex-row flex-grow">
        <Sidebar role="student" />
        <div className="flex flex-col items-center justify-center flex-grow py-8">
           
          <div className="w-full max-w-2xl p-8 shadow-xl bg-white/90 rounded-2xl">
            <StudentProfile />
            <h2 className="mb-6 text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 drop-shadow-lg">My Marks</h2>
            <div className="flex flex-col gap-2 mb-6 md:flex-row md:items-center md:justify-between">
              <div className="flex-1">
                <label htmlFor="teacher" className="block mb-2 text-sm font-medium text-gray-700">
                  Filter by Teacher
                </label>
                <select
                  id="teacher"
                  value={selectedTeacher}
                  onChange={(e) => setSelectedTeacher(e.target.value)}
                  className="block w-full py-2 pl-3 pr-10 mt-1 text-base border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  disabled={loadingTeachers}
                >
                  <option value="">All Teachers</option>
                  {teachers.map((teacher) => (
                    <option key={teacher._id} value={teacher._id}>
                      {teacher.fullName} - {teacher.subject}
                    </option>
                  ))}
                </select>
              </div>
              <button
                className="px-5 py-2 font-bold text-white transition-all shadow bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl hover:scale-105"
                onClick={handleDownloadExcel}
                disabled={marks.length === 0}
              >
                Download Report
              </button>
            </div>

            {loading ? (
              <div className="text-lg text-gray-600">Loading...</div>
            ) : marks.length === 0 ? (
              <div className="text-lg text-gray-600">No marks found.</div>
            ) : (
              <table className="w-full mt-4 text-center">
                <thead>
                  <tr className="text-purple-600">
                    <th className="py-2">Teacher</th>
                    <th className="py-2">Subject</th>
                    <th className="py-2">Exam Type</th>
                    <th className="py-2">Marks</th>
                    <th className="py-2">Date</th>
                    <th className="py-2">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {marks.map((m, i) => (
                    <tr key={m._id || i} className="hover:bg-purple-50">
                      <td className="py-2">{m.teacher?.fullName || 'N/A'}</td>
                      <td className="py-2">{m.teacher?.subject || 'N/A'}</td>
                      <td className="py-2">{m.examType}</td>
                      <td className="py-2">{m.marks}</td>
                      <td className="py-2">{new Date(m.date).toLocaleDateString()}</td>
                      <td className="py-2">{m.specialNote}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
