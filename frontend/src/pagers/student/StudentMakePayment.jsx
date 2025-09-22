
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStoredToken, getStoredUser } from '../../utils/auth';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function StudentMakePayment() {
  const navigate = useNavigate();
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
        const token = getStoredToken();
        if (!token) {
          throw new Error('No authentication token found');
        }
        const response = await fetch('http://localhost:5000/api/users?role=teacher', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
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
      const userData = getStoredUser();
      const token = getStoredToken();
      
      if (!userData || !userData.id) {
        navigate('/login');
        throw new Error('User ID not found. Please login again.');
      }

      if (!token) {
        navigate('/login');
        throw new Error('Authentication token not found. Please login again.');
      }

      const studentId = userData.id;

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
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...paymentData,
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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200">
      <Header />
      <div className="flex flex-col items-center justify-start flex-grow py-8 overflow-y-auto">
        <div className="w-full max-w-2xl p-8 shadow-xl bg-white/90 rounded-2xl">
          <h2 className="mb-6 text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 drop-shadow-lg">Make Payment</h2>
          
          {error && (
            <div className="px-4 py-3 mb-4 text-red-700 bg-red-100 border border-red-400 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-bold text-gray-700">
                Select Teacher
              </label>
              <select
                name="teacher"
                value={formData.teacher}
                onChange={handleChange}
                className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
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
              <label className="block mb-2 text-sm font-bold text-gray-700">
                Class ID
              </label>
              <input
                type="text"
                name="classId"
                value={formData.classId}
                onChange={handleChange}
                className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-bold text-gray-700">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-3 py-2 leading-tight text-gray-700 bg-gray-100 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                readOnly
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-bold text-gray-700">
                Course Name
              </label>
              <input
                type="text"
                name="courseName"
                value={formData.courseName}
                onChange={handleChange}
                className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-bold text-gray-700">
                Amount (Rs.)
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-bold text-gray-700">
                Notes (Optional)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
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
