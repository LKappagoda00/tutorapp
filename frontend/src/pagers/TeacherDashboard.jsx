import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getStoredToken } from '../utils/auth';

import Header from '../components/Header';
import Footer from '../components/Footer';

import Sidebar from '../components/Sidebar';
import TeacherStats from '../components/TeacherStats';

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');
  const [editedProfile, setEditedProfile] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = getStoredToken();
        if (!token) {
          navigate('/login');
          return;
        }
        const res = await axios.get('http://localhost:5000/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProfile(res.data);
        setEditedProfile(res.data);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [navigate]);

  const handleEdit = () => {
    setIsEditing(true);
    setUpdateMessage('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile(profile);
    setUpdateMessage('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = async () => {
    try {
      const token = getStoredToken();
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.put('http://localhost:5000/api/users/me', editedProfile, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setProfile(editedProfile);
      setIsEditing(false);
      setUpdateMessage('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200">
      <Header />
      <div className="flex flex-row flex-grow">
        <Sidebar role="teacher" />
        <div className="flex flex-col items-center justify-start flex-grow py-8 overflow-y-auto">
          <div className="flex flex-col items-center w-full max-w-5xl p-10 shadow-2xl bg-white/90 backdrop-blur-xl rounded-3xl animate-fade-in">
            <h1 className="mb-6 text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 drop-shadow-lg">Teacher Dashboard</h1>
            <p className="mb-8 text-lg text-gray-700">Welcome, Teacher!</p>
            {loading ? (
              <p>Loading profile...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : profile ? (
              <div className="w-full max-w-lg p-6 mb-8 bg-white shadow rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-blue-700">Your Profile</h2>
                  {!isEditing && (
                    <button
                      onClick={handleEdit}
                      className="px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
                
                {updateMessage && (
                  <div className="p-3 mb-4 text-green-700 bg-green-100 rounded-lg">
                    {updateMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-3">
                  {isEditing ? (
                    <>
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold">Full Name:</label>
                        <input
                          type="text"
                          name="fullName"
                          value={editedProfile.fullName}
                          onChange={handleChange}
                          className="p-2 border rounded-lg"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold">About:</label>
                        <textarea
                          name="about"
                          value={editedProfile.about}
                          onChange={handleChange}
                          className="p-2 border rounded-lg"
                          rows="3"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold">Bank Name:</label>
                        <input
                          type="text"
                          name="bankName"
                          value={editedProfile.bankName}
                          onChange={handleChange}
                          className="p-2 border rounded-lg"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold">Account Number:</label>
                        <input
                          type="text"
                          name="accountNumber"
                          value={editedProfile.accountNumber}
                          onChange={handleChange}
                          className="p-2 border rounded-lg"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold">Branch:</label>
                        <input
                          type="text"
                          name="branch"
                          value={editedProfile.branch}
                          onChange={handleChange}
                          className="p-2 border rounded-lg"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold">Beneficiary Name:</label>
                        <input
                          type="text"
                          name="beneficiaryName"
                          value={editedProfile.beneficiaryName}
                          onChange={handleChange}
                          className="p-2 border rounded-lg"
                        />
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={handleUpdate}
                          className="px-4 py-2 text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={handleCancel}
                          className="px-4 py-2 text-gray-700 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div><span className="font-semibold">Full Name:</span> {profile.fullName}</div>
                      <div><span className="font-semibold">NIC:</span> {profile.nic}</div>
                      <div><span className="font-semibold">Subject:</span> {profile.subject}</div>
                      <div><span className="font-semibold">About:</span> {profile.about}</div>
                      <div><span className="font-semibold">Bank Name:</span> {profile.bankName}</div>
                      <div><span className="font-semibold">Account Number:</span> {profile.accountNumber}</div>
                      <div><span className="font-semibold">Branch:</span> {profile.branch}</div>
                      <div><span className="font-semibold">Beneficiary Name:</span> {profile.beneficiaryName}</div>
                      <div><span className="font-semibold">Username:</span> {profile.userName}</div>
                    </>
                  )}
                </div>
              </div>
            ) : null}
            
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
