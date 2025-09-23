import React, { useState, useEffect } from 'react';
import { dummySubjects, dummyExamTypes } from '../data/dummySubjects';
import Header from '../components/Header';
import Footer from '../components/Footer';
//import Sidebar from '../components/Sidebar';
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
  const [formErrors, setFormErrors] = useState({});

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
    // Validation
    const errors = {};
    if (!form.studentId) errors.studentId = 'Student is required';
    if (!form.examType) errors.examType = 'Exam type is required';
    if (!form.subject) errors.subject = 'Subject is required';
    if (form.marks === '') {
      errors.marks = 'Marks are required';
    } else if (isNaN(form.marks) || form.marks < 0 || form.marks > 100) {
      errors.marks = 'Marks must be a number between 0 and 100';
    }
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200">
      <Header />
      <div className="flex flex-row flex-grow">
        {/* <Sidebar role="admin" /> */}
        <div className="flex flex-col items-center justify-center flex-grow py-8">
          <div className="w-full max-w-xl p-8 shadow-xl bg-white/90 rounded-2xl">
            <h2 className="mb-6 text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 drop-shadow-lg">Add Marks</h2>
            <form className="flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Student<span className="text-red-500">*</span></label>
                <select
                  className={`w-full px-4 py-2 transition border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400 ${formErrors.studentId ? 'border-red-500' : 'border-gray-300'}`}
                  name="studentId"
                  value={form.studentId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Student</option>
                  {students.map(student => (
                    <option key={student._id || student.id} value={student._id || student.id}>
                      {student.fullName || student.name || student.id}
                    </option>
                  ))}
                </select>
                {formErrors.studentId && <p className="mt-1 text-sm text-red-500">{formErrors.studentId}</p>}
              </div>

              <div>
                <label className="block mb-2 font-semibold text-gray-700">Exam Type<span className="text-red-500">*</span></label>
                <select
                  className={`w-full px-4 py-2 transition border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400 ${formErrors.examType ? 'border-red-500' : 'border-gray-300'}`}
                  name="examType"
                  value={form.examType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Exam Type</option>
                  {examTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {formErrors.examType && <p className="mt-1 text-sm text-red-500">{formErrors.examType}</p>}
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Subject<span className="text-red-500">*</span></label>
                <select
                  className={`w-full px-4 py-2 transition border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400 ${formErrors.subject ? 'border-red-500' : 'border-gray-300'}`}
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Subject</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
                {formErrors.subject && <p className="mt-1 text-sm text-red-500">{formErrors.subject}</p>}
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Marks<span className="text-red-500">*</span></label>
                <input
                  type="number"
                  className={`w-full px-4 py-2 transition border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400 ${formErrors.marks ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="e.g. 85"
                  name="marks"
                  value={form.marks}
                  onChange={handleChange}
                  required
                  min={0}
                  max={100}
                />
                {formErrors.marks && <p className="mt-1 text-sm text-red-500">{formErrors.marks}</p>}
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Special Note</label>
                <input
                  className="w-full px-4 py-2 transition border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="e.g. Excellent improvement"
                  name="note"
                  value={form.note}
                  onChange={handleChange}
                />
              </div>
              <button type="submit" className="w-full py-3 text-lg font-extrabold tracking-wide text-white transition-all shadow-lg bg-gradient-to-r from-green-500 to-blue-500 rounded-xl hover:scale-105">Add Marks</button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
