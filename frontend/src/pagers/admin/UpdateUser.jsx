import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Sidebar from '../../components/Sidebar';
import { useNavigate, useParams } from 'react-router-dom';

export default function UpdateUser() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Get token from localStorage
  const getAuthToken = () => {
    try {
      const tokenData = localStorage.getItem('token');
      if (!tokenData) return null;
      const { value } = JSON.parse(tokenData);
      return value;
    } catch {
      return null;
    }
  };

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          setError('Not authenticated. Please login again.');
          navigate('/login');
          return;
        }

        const response = await fetch(`http://localhost:5000/api/users/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 401) {
          setError('Session expired. Please login again.');
          navigate('/login');
          return;
        }

        const data = await response.json();
        if (response.ok) {
          setUser(data);
        } else {
          setError(data.error || 'Failed to fetch user data');
        }
      } catch (err) {
        setError('Error connecting to server');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, navigate]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      const token = getAuthToken();
      if (!token) {
        setError('Not authenticated. Please login again.');
        navigate('/login');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      });

      if (response.status === 401) {
        setError('Session expired. Please login again.');
        navigate('/login');
        return;
      }

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage('User updated successfully');
        setTimeout(() => navigate('/admin-users'), 1500);
      } else {
        setError(data.error || 'Failed to update user');
      }
    } catch (err) {
      setError('Error connecting to server');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200">
      <Header />
      <div className="flex-grow flex flex-row">
        <Sidebar role="admin" />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-xl font-semibold text-purple-600">Loading user data...</div>
        </div>
      </div>
      <Footer />
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200">
      <Header />
      <div className="flex-grow flex flex-row">
        <Sidebar role="admin" />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-xl font-semibold text-red-600">{error}</div>
        </div>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200">
      <Header />
      <div className="flex-grow flex flex-row">
        <Sidebar role="admin" />
        <div className="flex-grow flex flex-col items-center justify-center py-8">
          <div className="bg-white/90 rounded-2xl shadow-xl p-8 w-full max-w-xl">
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-6 drop-shadow-lg text-center">
              Update {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
            </h2>
            
            {successMessage && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-center">
                {successMessage}
              </div>
            )}

            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Full Name</label>
                <input
                  name="fullName"
                  value={user?.fullName || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow"
                  placeholder="Full Name"
                  required
                />
              </div>

              {/* Role specific fields */}
              {user?.role === 'student' && (
                <>
                  <div>
                    <label className="block mb-2 font-semibold text-gray-700">Username</label>
                    <input
                      name="userName"
                      value={user?.userName || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow"
                      placeholder="Username"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold text-gray-700">Date of Birth</label>
                    <input
                      type="date"
                      name="dob"
                      value={user?.dob ? new Date(user.dob).toISOString().split('T')[0] : ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold text-gray-700">Address</label>
                    <input
                      name="address"
                      value={user?.address || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow"
                      placeholder="Address"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold text-gray-700">Phone</label>
                    <input
                      name="phone"
                      value={user?.phone || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow"
                      placeholder="Phone Number"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold text-gray-700">Class Student</label>
                    <select
                      name="isClassStudent"
                      value={user?.isClassStudent || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow"
                    >
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                </>
              )}

              {user?.role === 'teacher' && (
                <>
                  <div>
                    <label className="block mb-2 font-semibold text-gray-700">NIC</label>
                    <input
                      name="nic"
                      value={user?.nic || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow"
                      placeholder="NIC Number"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold text-gray-700">Subject</label>
                    <input
                      name="subject"
                      value={user?.subject || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow"
                      placeholder="Subject"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold text-gray-700">About</label>
                    <textarea
                      name="about"
                      value={user?.about || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow"
                      placeholder="About"
                      rows="3"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold text-gray-700">Bank Name</label>
                    <input
                      name="bankName"
                      value={user?.bankName || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow"
                      placeholder="Bank Name"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold text-gray-700">Account Number</label>
                    <input
                      name="accountNumber"
                      value={user?.accountNumber || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow"
                      placeholder="Account Number"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold text-gray-700">Branch</label>
                    <input
                      name="branch"
                      value={user?.branch || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow"
                      placeholder="Branch"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold text-gray-700">Beneficiary Name</label>
                    <input
                      name="beneficiaryName"
                      value={user?.beneficiaryName || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow"
                      placeholder="Beneficiary Name"
                    />
                  </div>
                </>
              )}

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-extrabold rounded-xl shadow-lg hover:scale-105 transition-all text-lg tracking-wide"
                >
                  Update User
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/admin-users')}
                  className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white font-extrabold rounded-xl shadow-lg hover:scale-105 transition-all text-lg tracking-wide"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
