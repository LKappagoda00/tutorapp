import React, { useState, useEffect } from 'react';
import { getStoredUser, getStoredToken } from '../../utils/auth';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function StudentProfile() {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const token = getStoredToken();
        const user = getStoredUser();

        if (!token || !user) {
          navigate('/login');
          return;
        }

        const userId = user.id || user._id || user.userId;
        if (!userId) {
          setError('User ID not found');
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/api/users/${userId}`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );

        if (!response.data) throw new Error('No data received from server');
        setStudentData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Profile fetch error:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load profile');
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [navigate]);

  const handleEdit = () => {
    setUpdatedData(studentData);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setUpdatedData(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleUpdate = async () => {
    const errors = {};
    if (!updatedData?.fullName || updatedData.fullName.trim().length < 2) {
      errors.fullName = 'Full Name is required (min 2 characters)';
    }
    if (!updatedData?.dob) {
      errors.dob = 'Date of Birth is required';
    } else {
      const today = new Date();
      const dobDate = new Date(updatedData.dob);
      if (dobDate > today) errors.dob = 'Date of Birth cannot be in the future';
    }
    if (!updatedData?.address || updatedData.address.trim().length < 3) {
      errors.address = 'Address is required (min 3 characters)';
    }
    if (!updatedData?.phone || !/^\d{10,}$/.test(updatedData.phone)) {
      errors.phone = 'Valid phone number is required (min 10 digits)';
    }
    if (!updatedData?.isClassStudent) {
      errors.isClassStudent = 'Please select class student status';
    }

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      setUpdating(true);
      const token = getStoredToken();
      const user = getStoredUser();
      const userId = user.id || user._id || user.userId;

      const response = await axios.put(
        `http://localhost:5000/api/users/${userId}`,
        updatedData,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      setStudentData(response.data);
      setIsEditing(false);
      setUpdating(false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      console.error('Update error:', err);
      toast.error(err.response?.data?.message || 'Failed to update profile');
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        {/* Animated Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute rounded-full top-20 left-20 w-72 h-72 bg-blue-400/20 blur-3xl animate-pulse"></div>
          <div className="absolute delay-1000 rounded-full bottom-20 right-20 w-96 h-96 bg-purple-400/20 blur-3xl animate-pulse"></div>
          <div className="absolute w-64 h-64 delay-500 transform -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 left-1/2 bg-pink-400/10 blur-2xl animate-pulse"></div>
        </div>
        
        <div className="relative z-10 text-center">
          <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="absolute inset-0 border-4 rounded-full border-white/30 animate-spin border-t-white"></div>
            <div className="absolute border-4 border-purple-400 rounded-full inset-4 animate-spin border-t-purple-200" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            <div className="absolute border-4 border-pink-400 rounded-full inset-8 animate-ping"></div>
          </div>
          <p className="text-2xl font-bold text-white animate-pulse">Loading your profile...</p>
          <p className="mt-2 text-lg text-white/70">Preparing your academic journey</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-red-900 via-pink-900 to-purple-900">
        <div className="w-full max-w-md p-8 text-center border bg-white/10 backdrop-blur-lg rounded-3xl border-red-300/20">
          <div className="mb-6 text-6xl">⚠️</div>
          <h2 className="mb-4 text-2xl font-bold text-white">Oops! Something went wrong</h2>
          <p className="text-lg text-red-200">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 mt-6 font-semibold text-white transition-all duration-300 transform bg-gradient-to-r from-red-500 to-pink-500 rounded-xl hover:from-red-600 hover:to-pink-600 hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
        <div className="w-full max-w-md p-8 text-center border bg-white/10 backdrop-blur-lg rounded-3xl border-gray-300/20">
          <div className="mb-6 text-6xl">📭</div>
          <h2 className="mb-4 text-2xl font-bold text-white">No Profile Data</h2>
          <p className="text-gray-200">Your profile information could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute rounded-full -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-3xl animate-pulse"></div>
        <div className="absolute delay-1000 rounded-full -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-pink-400/20 to-indigo-400/20 blur-3xl animate-pulse"></div>
        <div className="absolute w-64 h-64 delay-500 rounded-full top-1/3 left-1/4 bg-gradient-to-r from-purple-300/10 to-blue-300/10 blur-2xl animate-pulse"></div>
        <div className="absolute w-48 h-48 delay-700 rounded-full bottom-1/3 right-1/4 bg-gradient-to-l from-pink-300/10 to-purple-300/10 blur-2xl animate-pulse"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-white/20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl">
          {/* Profile Card */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-all duration-500">
            {/* Header */}
            <div className="p-6 border-b bg-gradient-to-r from-purple-600/30 to-pink-600/30 sm:p-8 border-white/10">
              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-16 h-16 border sm:w-20 sm:h-20 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl border-white/30">
                    <span className="text-3xl sm:text-4xl">👤</span>
                  </div>
                  <div>
                    <h2 className="mb-2 text-2xl font-black text-white sm:text-3xl lg:text-4xl animate-fade-in">
                      Student Profile
                    </h2>
                    <p className="text-sm text-white/70 sm:text-base animate-slide-up">Manage your academic information</p>
                  </div>
                </div>
                {!isEditing && (
                  <button 
                    onClick={handleEdit} 
                    className="flex items-center gap-2 px-6 py-3 font-semibold text-white transition-all duration-300 transform border shadow-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-xl hover:scale-105 active:scale-95 hover:shadow-xl border-white/20"
                  >
                    <span className="text-lg">✏️</span>
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            {/* Body */}
            <div className="p-6 sm:p-8 lg:p-10">
              {isEditing ? (
                <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }} className="space-y-6" noValidate>
                  {/* Full Name */}
                  <div className="group">
                    <label className="flex items-center block gap-2 mb-3 text-lg font-semibold text-white">
                      <span className="text-xl">👤</span>
                      Full Name 
                      <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <input 
                        type="text" 
                        name="fullName" 
                        value={updatedData?.fullName || ''} 
                        onChange={handleChange} 
                        className="w-full p-4 text-white transition-all duration-300 border-2 bg-white/10 border-white/20 rounded-xl placeholder-white/50 focus:outline-none focus:ring-4 focus:ring-purple-400/50 focus:border-purple-400 backdrop-blur-sm hover:bg-white/15"
                        placeholder="Enter your full name"
                      />
                      <div className="absolute inset-0 transition-opacity duration-300 opacity-0 pointer-events-none bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl group-hover:opacity-100"></div>
                    </div>
                    {formErrors.fullName && (
                      <p className="flex items-center gap-2 mt-2 text-sm text-red-300">
                        <span>⚠️</span>
                        {formErrors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Date of Birth */}
                  <div className="group">
                    <label className="flex items-center block gap-2 mb-3 text-lg font-semibold text-white">
                      <span className="text-xl">📅</span>
                      Date of Birth 
                      <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <input 
                        type="date" 
                        name="dob" 
                        value={updatedData?.dob?.split('T')[0] || ''} 
                        onChange={handleChange} 
                        className="w-full p-4 text-white transition-all duration-300 border-2 bg-white/10 border-white/20 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-400/50 focus:border-purple-400 backdrop-blur-sm hover:bg-white/15"
                      />
                      <div className="absolute inset-0 transition-opacity duration-300 opacity-0 pointer-events-none bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl group-hover:opacity-100"></div>
                    </div>
                    {formErrors.dob && (
                      <p className="flex items-center gap-2 mt-2 text-sm text-red-300">
                        <span>⚠️</span>
                        {formErrors.dob}
                      </p>
                    )}
                  </div>

                  {/* Address */}
                  <div className="group">
                    <label className="flex items-center block gap-2 mb-3 text-lg font-semibold text-white">
                      <span className="text-xl">🏠</span>
                      Address 
                      <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <input 
                        type="text" 
                        name="address" 
                        value={updatedData?.address || ''} 
                        onChange={handleChange} 
                        className="w-full p-4 text-white transition-all duration-300 border-2 bg-white/10 border-white/20 rounded-xl placeholder-white/50 focus:outline-none focus:ring-4 focus:ring-purple-400/50 focus:border-purple-400 backdrop-blur-sm hover:bg-white/15"
                        placeholder="Enter your address"
                      />
                      <div className="absolute inset-0 transition-opacity duration-300 opacity-0 pointer-events-none bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl group-hover:opacity-100"></div>
                    </div>
                    {formErrors.address && (
                      <p className="flex items-center gap-2 mt-2 text-sm text-red-300">
                        <span>⚠️</span>
                        {formErrors.address}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="group">
                    <label className="flex items-center block gap-2 mb-3 text-lg font-semibold text-white">
                      <span className="text-xl">📱</span>
                      Phone Number 
                      <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <input 
                        type="tel" 
                        name="phone" 
                        value={updatedData?.phone || ''} 
                        onChange={handleChange} 
                        className="w-full p-4 text-white transition-all duration-300 border-2 bg-white/10 border-white/20 rounded-xl placeholder-white/50 focus:outline-none focus:ring-4 focus:ring-purple-400/50 focus:border-purple-400 backdrop-blur-sm hover:bg-white/15"
                        placeholder="Enter your phone number"
                      />
                      <div className="absolute inset-0 transition-opacity duration-300 opacity-0 pointer-events-none bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl group-hover:opacity-100"></div>
                    </div>
                    {formErrors.phone && (
                      <p className="flex items-center gap-2 mt-2 text-sm text-red-300">
                        <span>⚠️</span>
                        {formErrors.phone}
                      </p>
                    )}
                  </div>

                  {/* Class Status */}
                  <div className="group">
                    <label className="flex items-center block gap-2 mb-3 text-lg font-semibold text-white">
                      <span className="text-xl">🎓</span>
                      Class Student Status 
                      <span className="text-red-400">*</span>
                    </label>
                    <div className="flex gap-6">
                      <label className="flex items-center gap-3 cursor-pointer group/radio">
                        <div className="relative">
                          <input 
                            type="radio" 
                            name="isClassStudent" 
                            value="yes" 
                            checked={updatedData?.isClassStudent === 'yes'} 
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <div className={`w-6 h-6 rounded-full border-2 transition-all duration-300 ${updatedData?.isClassStudent === 'yes' ? 'bg-emerald-500 border-emerald-400' : 'border-white/40 bg-white/10'}`}>
                            {updatedData?.isClassStudent === 'yes' && (
                              <div className="absolute w-2 h-2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full top-1/2 left-1/2"></div>
                            )}
                          </div>
                        </div>
                        <span className="font-medium text-white transition-colors group-hover/radio:text-emerald-300">✅ Yes</span>
                      </label>
                      
                      <label className="flex items-center gap-3 cursor-pointer group/radio">
                        <div className="relative">
                          <input 
                            type="radio" 
                            name="isClassStudent" 
                            value="no" 
                            checked={updatedData?.isClassStudent === 'no'} 
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <div className={`w-6 h-6 rounded-full border-2 transition-all duration-300 ${updatedData?.isClassStudent === 'no' ? 'bg-red-500 border-red-400' : 'border-white/40 bg-white/10'}`}>
                            {updatedData?.isClassStudent === 'no' && (
                              <div className="absolute w-2 h-2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full top-1/2 left-1/2"></div>
                            )}
                          </div>
                        </div>
                        <span className="font-medium text-white transition-colors group-hover/radio:text-red-300">❌ No</span>
                      </label>
                    </div>
                    {formErrors.isClassStudent && (
                      <p className="flex items-center gap-2 mt-2 text-sm text-red-300">
                        <span>⚠️</span>
                        {formErrors.isClassStudent}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-4 pt-6 sm:flex-row">
                    <button 
                      type="submit" 
                      disabled={updating} 
                      className="flex items-center justify-center flex-1 gap-3 px-6 py-4 font-bold text-white transition-all duration-300 transform shadow-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:from-gray-400 disabled:to-gray-500 rounded-xl hover:scale-105 active:scale-95 disabled:hover:scale-100 hover:shadow-xl"
                    >
                      {updating ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                          Updating...
                        </>
                      ) : (
                        <>
                          <span className="text-xl">💾</span>
                          Save Changes
                        </>
                      )}
                    </button>
                    <button 
                      type="button" 
                      onClick={handleCancel} 
                      className="flex items-center justify-center flex-1 gap-3 px-6 py-4 font-bold text-white transition-all duration-300 transform border-2 bg-white/10 hover:bg-white/20 rounded-xl hover:scale-105 active:scale-95 border-white/20 hover:border-white/40"
                    >
                      <span className="text-xl">❌</span>
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  {/* Info Cards */}
                  <div className="p-6 transition-all duration-300 transform border bg-white/5 backdrop-blur-sm rounded-2xl border-white/10 hover:bg-white/10 hover:scale-105">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-xl">
                        <span className="text-2xl">👤</span>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-white/60">Full Name</h3>
                        <p className="text-lg font-semibold text-white">{studentData?.fullName || 'Not available'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 transition-all duration-300 transform border bg-white/5 backdrop-blur-sm rounded-2xl border-white/10 hover:bg-white/10 hover:scale-105">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-xl">
                        <span className="text-2xl">🆔</span>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-white/60">User Name</h3>
                        <p className="text-lg font-semibold text-white">{studentData?.userName || 'Not available'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 transition-all duration-300 transform border bg-white/5 backdrop-blur-sm rounded-2xl border-white/10 hover:bg-white/10 hover:scale-105">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-yellow-500/30 to-orange-500/30 rounded-xl">
                        <span className="text-2xl">📅</span>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-white/60">Date of Birth</h3>
                        <p className="text-lg font-semibold text-white">{studentData?.dob ? new Date(studentData.dob).toLocaleDateString() : 'Not available'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 transition-all duration-300 transform border bg-white/5 backdrop-blur-sm rounded-2xl border-white/10 hover:bg-white/10 hover:scale-105">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-pink-500/30 to-red-500/30 rounded-xl">
                        <span className="text-2xl">🏠</span>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-white/60">Address</h3>
                        <p className="text-lg font-semibold text-white">{studentData?.address || 'Not available'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 transition-all duration-300 transform border bg-white/5 backdrop-blur-sm rounded-2xl border-white/10 hover:bg-white/10 hover:scale-105">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-500/30 to-purple-500/30 rounded-xl">
                        <span className="text-2xl">📱</span>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-white/60">Phone Number</h3>
                        <p className="text-lg font-semibold text-white">{studentData?.phone || 'Not available'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 transition-all duration-300 transform border bg-white/5 backdrop-blur-sm rounded-2xl border-white/10 hover:bg-white/10 hover:scale-105">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-teal-500/30 to-cyan-500/30 rounded-xl">
                        <span className="text-2xl">🎓</span>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-white/60">Class Student</h3>
                        <p className="flex items-center gap-2 text-lg font-semibold text-white">
                          {studentData?.isClassStudent === 'yes' ? (
                            <>
                              <span className="text-emerald-400">✅</span>
                              Yes
                            </>
                          ) : (
                            <>
                              <span className="text-red-400">❌</span>
                              No
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 transition-all duration-300 transform border bg-white/5 backdrop-blur-sm rounded-2xl border-white/10 hover:bg-white/10 hover:scale-105 lg:col-span-2">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-violet-500/30 to-purple-500/30 rounded-xl">
                        <span className="text-2xl">📆</span>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-white/60">Member Since</h3>
                        <p className="text-lg font-semibold text-white">{studentData?.createdAt ? new Date(studentData.createdAt).toLocaleDateString() : 'Not available'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 1s ease-out 0.3s both;
        }
      `}</style>
    </div>
  );
}

export default StudentProfile;