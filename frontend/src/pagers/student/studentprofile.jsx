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
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (!response.data) {
          throw new Error('No data received from server');
        }

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
    setUpdatedData(prev => ({
      ...prev,
      [name]: value
    }));
    setFormErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleUpdate = async () => {
    // Validation
    const errors = {};
    if (!updatedData?.fullName || updatedData.fullName.trim().length < 2) {
      errors.fullName = 'Full Name is required (min 2 characters)';
    }
    if (!updatedData?.dob) {
      errors.dob = 'Date of Birth is required';
    } else {
      const today = new Date();
      const dobDate = new Date(updatedData.dob);
      if (dobDate > today) {
        errors.dob = 'Date of Birth cannot be in the future';
      }
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
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
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

  if (loading) return <div className="flex items-center justify-center min-h-screen">
    <div className="text-lg font-semibold text-gray-600">Loading profile...</div>
  </div>;

  if (error) return <div className="flex items-center justify-center min-h-screen">
    <div className="text-lg font-semibold text-red-600">Error: {error}</div>
  </div>;

  if (!studentData) return <div className="flex items-center justify-center min-h-screen">
    <div className="text-lg font-semibold text-gray-600">No profile data found</div>
  </div>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200">
      <div className="relative w-full max-w-lg">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-blue-400 via-purple-400 to-pink-400 blur-2xl opacity-40 animate-pulse"></div>
        <div className="relative z-10 flex flex-col items-center p-10 shadow-2xl bg-white/90 backdrop-blur-xl rounded-3xl">
          <div className="flex items-center justify-between w-full mb-6">
            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 drop-shadow-lg">
              Student Profile
            </h2>
            {!isEditing && (
              <button
                onClick={handleEdit}
                className="px-4 py-2 text-sm font-medium text-white transition-all bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Edit Profile
              </button>
            )}
          </div>
          
          <div className="w-full space-y-6">
            {isEditing ? (
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleUpdate(); }} noValidate>
                <div>
                  <label className="block mb-2 font-semibold text-gray-700">Full Name<span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="fullName"
                    value={updatedData?.fullName || ''}
                    onChange={handleChange}
                    required
                    minLength={2}
                    className={`w-full px-4 py-2 transition border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${formErrors.fullName ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {formErrors.fullName && <p className="mt-1 text-sm text-red-500">{formErrors.fullName}</p>}
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-gray-700">Date of Birth<span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    name="dob"
                    value={updatedData?.dob?.split('T')[0] || ''}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-2 transition border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${formErrors.dob ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {formErrors.dob && <p className="mt-1 text-sm text-red-500">{formErrors.dob}</p>}
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-gray-700">Address<span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="address"
                    value={updatedData?.address || ''}
                    onChange={handleChange}
                    required
                    minLength={3}
                    className={`w-full px-4 py-2 transition border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${formErrors.address ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {formErrors.address && <p className="mt-1 text-sm text-red-500">{formErrors.address}</p>}
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-gray-700">Phone Number<span className="text-red-500">*</span></label>
                  <input
                    type="tel"
                    name="phone"
                    value={updatedData?.phone || ''}
                    onChange={handleChange}
                    required
                    pattern="\d{10,}"
                    className={`w-full px-4 py-2 transition border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${formErrors.phone ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {formErrors.phone && <p className="mt-1 text-sm text-red-500">{formErrors.phone}</p>}
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-gray-700">Class Student Status<span className="text-red-500">*</span></label>
                  <div className="flex gap-6">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="isClassStudent"
                        value="yes"
                        checked={updatedData?.isClassStudent === 'yes'}
                        onChange={handleChange}
                        required
                        className="text-blue-500 form-radio"
                      />
                      <span className="ml-2">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="isClassStudent"
                        value="no"
                        checked={updatedData?.isClassStudent === 'no'}
                        onChange={handleChange}
                        required
                        className="text-pink-500 form-radio"
                      />
                      <span className="ml-2">No</span>
                    </label>
                  </div>
                  {formErrors.isClassStudent && <p className="mt-1 text-sm text-red-500">{formErrors.isClassStudent}</p>}
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={updating}
                    className={`flex-1 py-2 text-white font-semibold rounded-lg ${
                      updating
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {updating ? 'Updating...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={updating}
                    className="flex-1 py-2 font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block mb-2 font-semibold text-gray-700">Full Name</label>
                  <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                    {studentData?.fullName || 'Not available'}
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block mb-2 font-semibold text-gray-700">User Name</label>
                  <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                    {studentData?.userName || 'Not available'}
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block mb-2 font-semibold text-gray-700">Date of Birth</label>
                  <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                    {studentData?.dob ? new Date(studentData.dob).toLocaleDateString() : 'Not available'}
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block mb-2 font-semibold text-gray-700">Address</label>
                  <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                    {studentData?.address || 'Not available'}
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block mb-2 font-semibold text-gray-700">Phone Number</label>
                  <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                    {studentData?.phone || 'Not available'}
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block mb-2 font-semibold text-gray-700">Class Student Status</label>
                  <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                    {studentData?.isClassStudent === 'yes' ? 'Yes' : 'No'}
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block mb-2 font-semibold text-gray-700">Account Created</label>
                  <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                    {studentData?.createdAt ? new Date(studentData.createdAt).toLocaleDateString() : 'Not available'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentProfile;