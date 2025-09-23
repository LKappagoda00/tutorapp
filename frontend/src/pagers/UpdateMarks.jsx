import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
//import Sidebar from '../components/Sidebar';
import { useNavigate, useParams } from 'react-router-dom';

export default function UpdateMarks() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = React.useState({
    student: '',
    examType: '',
    lesson: '',
    marks: '',
    specialNote: ''
  });
  const [formErrors, setFormErrors] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [students, setStudents] = React.useState([]);
  const examTypes = ['Term Test', 'Monthly Quiz', 'Final Exam'];
  const lessons = ['Algebra', 'Photosynthesis', 'World History'];

  React.useEffect(() => {
    // Fetch mark by ID
    fetch(`http://localhost:5000/api/marks/${id}`)
      .then(res => res.json())
      .then(data => {
        setForm({
          student: data.student?._id || data.student || '',
          examType: data.examType || '',
          lesson: data.lesson || '',
          marks: data.marks || '',
          specialNote: data.specialNote || data.note || ''
        });
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch mark');
        setLoading(false);
      });
    // Fetch students for dropdown
    fetch('http://localhost:5000/api/users')
      .then(res => res.json())
      .then(data => setStudents(data.filter(u => u.role === 'student')))
      .catch(() => setStudents([]));
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    // Validation
    const errors = {};
    if (!form.student) errors.student = 'Student is required';
    if (!form.examType) errors.examType = 'Exam type is required';
    if (!form.lesson) errors.lesson = 'Lesson is required';
    if (form.marks === '') {
      errors.marks = 'Marks are required';
    } else if (isNaN(form.marks) || form.marks < 0 || form.marks > 100) {
      errors.marks = 'Marks must be a number between 0 and 100';
    }
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    try {
      const res = await fetch(`http://localhost:5000/api/marks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        navigate('/admin-marks');
      } else {
        alert('Failed to update marks');
      }
    } catch {
      alert('Error updating marks');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200">
      <Header />
      <div className="flex flex-row flex-grow">
        {/* <Sidebar role="admin" /> */}
        <div className="flex flex-col items-center justify-center flex-grow py-8">
          <div className="w-full max-w-xl p-8 shadow-xl bg-white/90 rounded-2xl">
            <h2 className="mb-6 text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 drop-shadow-lg">Update Marks</h2>
            {loading ? (
              <div className="text-lg text-center text-gray-500">Loading...</div>
            ) : error ? (
              <div className="text-lg text-center text-red-500">{error}</div>
            ) : (
              <form className="flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
                <div>
                  <label className="block mb-2 font-semibold text-gray-700">Student<span className="text-red-500">*</span></label>
                  <select
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow ${formErrors.student ? 'border-red-500' : 'border-gray-300'}`}
                    name="student"
                    value={form.student}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Student</option>
                    {students.map(s => (
                      <option key={s._id || s.id} value={s._id || s.id}>{s.fullName || s.userName || s.id}</option>
                    ))}
                  </select>
                  {formErrors.student && <p className="mt-1 text-sm text-red-500">{formErrors.student}</p>}
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-gray-700">Exam Type<span className="text-red-500">*</span></label>
                  <select
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow ${formErrors.examType ? 'border-red-500' : 'border-gray-300'}`}
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
                  <label className="block mb-2 font-semibold text-gray-700">Lesson<span className="text-red-500">*</span></label>
                  <select
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow ${formErrors.lesson ? 'border-red-500' : 'border-gray-300'}`}
                    name="lesson"
                    value={form.lesson}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Lesson</option>
                    {lessons.map(lesson => (
                      <option key={lesson} value={lesson}>{lesson}</option>
                    ))}
                  </select>
                  {formErrors.lesson && <p className="mt-1 text-sm text-red-500">{formErrors.lesson}</p>}
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-gray-700">Marks<span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow ${formErrors.marks ? 'border-red-500' : 'border-gray-300'}`}
                    name="marks"
                    value={form.marks}
                    onChange={handleChange}
                    placeholder="e.g. 85"
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
                    name="specialNote"
                    value={form.specialNote}
                    onChange={handleChange}
                    placeholder="e.g. Excellent improvement"
                  />
                </div>
                <button type="submit" className="w-full py-3 text-lg font-extrabold tracking-wide text-white transition-all shadow-lg bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl hover:scale-105">Update Marks</button>
              </form>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
