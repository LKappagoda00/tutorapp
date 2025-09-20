
import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function StudentMakePayment() {
  const [formData, setFormData] = useState({
    teacher: '',
    classId: '',
    subject: '',
    courseName: '',
    amount: '',
    notes: ''
  });
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users?role=teacher');
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch teachers');
        }
        setTeachers(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchTeachers();
  }, []);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-fill subject when teacher is selected
    if (name === 'teacher' && value) {
      try {
        const selectedTeacher = teachers.find(t => t._id === value);
        if (selectedTeacher && selectedTeacher.subject) {
          setFormData(prev => ({
            ...prev,
            subject: selectedTeacher.subject
          }));
        } else {
          setError('Selected teacher has no assigned subject');
          setFormData(prev => ({
            ...prev,
            subject: ''
          }));
        }
      } catch (err) {
        setError('Failed to get teacher subject');
        setFormData(prev => ({
          ...prev,
          subject: ''
        }));
      }
    }
  };

  const validateForm = () => {
    if (!formData.teacher) {
      setError('Please select a teacher');
      return false;
    }
    if (!formData.classId) {
      setError('Please enter a class ID');
      return false;
    }
    if (!formData.subject) {
      setError('Subject is required');
      return false;
    }
    if (!formData.courseName) {
      setError('Please enter a course name');
      return false;
    }
    if (!formData.amount || formData.amount <= 0) {
      setError('Please enter a valid amount');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      // Get the student ID from localStorage user data
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const studentId = userData.id;
      const token = JSON.parse(localStorage.getItem('token') || '{}').value;
      
      if (!studentId) {
        throw new Error('User ID not found. Please login again.');
      }

      if (!token) {
        throw new Error('Authentication token not found. Please login again.');
      }

      // Check if token is expired
      const tokenData = JSON.parse(localStorage.getItem('token') || '{}');
      if (tokenData.expiry && new Date().getTime() > tokenData.expiry) {
        throw new Error('Session expired. Please login again.');
      }

      const paymentData = {
        ...formData,
        student: studentId,
        amount: Number(formData.amount),
        status: 'pending'
      };
      
      console.log('Sending payment data:', paymentData);
      
      const response = await fetch('http://localhost:5000/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          student: studentId,
          amount: Number(formData.amount),
          status: 'pending'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      // Reset form and show success message
      setFormData({
        teacher: '',
        classId: '',
        subject: '',
        courseName: '',
        amount: '',
        notes: ''
      });
      alert('Payment submitted successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200">
      <Header />
      <div className="flex-grow flex flex-col items-center justify-start py-8 overflow-y-auto">
        <div className="bg-white/90 rounded-2xl shadow-xl p-8 w-full max-w-2xl">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-6 drop-shadow-lg">Make Payment</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Select Teacher
              </label>
              <select
                name="teacher"
                value={formData.teacher}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
                <option value="">Select a teacher</option>
                {teachers.map((teacher) => (
                  <option key={teacher._id} value={teacher._id}>
                    {teacher.userName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Class ID
              </label>
              <input
                type="text"
                name="classId"
                value={formData.classId}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
                readOnly
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Course Name
              </label>
              <input
                type="text"
                name="courseName"
                value={formData.courseName}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Amount (Rs.)
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Notes (Optional)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows="3"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
            >
              {loading ? 'Processing...' : 'Submit Payment'}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
