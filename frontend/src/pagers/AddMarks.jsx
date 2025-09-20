import React, { useState, useEffect } from 'react';
import { dummySubjects, dummyExamTypes } from '../data/dummySubjects';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';

export default function AddMarks() {

  const navigate = useNavigate();
  // Student list state
  const [students, setStudents] = useState([]);
  const examTypes = dummyExamTypes;
  const subjects = dummySubjects.map(sub => sub.name);
  // Form state
  // Get teacher id from localStorage (expects JSON with id property)
  let teacherId = '';
  try {
    const teacherRaw = localStorage.getItem('user');
    if (teacherRaw) {
      const teacherObj = JSON.parse(teacherRaw);
      teacherId = teacherObj.id || teacherObj._id || '';
    }
  } catch {}
  const [form, setForm] = useState({
    studentId: '',
    examType: '',
    subject: '',
    marks: '',
    note: ''
  });

  useEffect(() => {
    // Fetch students from API
    fetch('http://localhost:5000/api/users')
      .then(res => res.json())
      .then(data => {
        // Expecting data to be an array of user objects with id and name
        setStudents(data.filter(u => u.role === 'student'));
      })
      .catch(() => setStudents([]));
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/marks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student: form.studentId,
          examType: form.examType,
          lesson: form.subject,
          marks: form.marks,
          note: form.note,
          teacher: teacherId
        })
      });
      if (res.ok) {
        navigate('/admin-marks');
      } else {
        alert('Failed to add marks');
      }
    } catch (err) {
      alert('Error connecting to server');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200">
      <Header />
      <div className="flex-grow flex flex-row">
        <Sidebar role="admin" />
        <div className="flex-grow flex flex-col items-center justify-center py-8">
          <div className="bg-white/90 rounded-2xl shadow-xl p-8 w-full max-w-xl">
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-6 drop-shadow-lg text-center">Add Marks</h2>
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Student</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow"
                  name="studentId"
                  value={form.studentId}
                  onChange={handleChange}
                >
                  <option value="">Select Student</option>
                  {students.map(student => (
                    <option key={student._id || student.id} value={student._id || student.id}>
                      {student.fullName || student.name || student.id}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 font-semibold text-gray-700">Exam Type</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow"
                  name="examType"
                  value={form.examType}
                  onChange={handleChange}
                >
                  <option value="">Select Exam Type</option>
                  {examTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Subject</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                >
                  <option value="">Select Subject</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Marks</label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow"
                  placeholder="e.g. 85"
                  name="marks"
                  value={form.marks}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Special Note</label>
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow"
                  placeholder="e.g. Excellent improvement"
                  name="note"
                  value={form.note}
                  onChange={handleChange}
                />
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
