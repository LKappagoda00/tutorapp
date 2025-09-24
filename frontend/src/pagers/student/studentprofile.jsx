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

  if (loading) return <div style={styles.centerText}>Loading profile...</div>;
  if (error) return <div style={styles.errorText}>Error: {error}</div>;
  if (!studentData) return <div style={styles.centerText}>No profile data found</div>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Student Profile</h2>
          {!isEditing && (
            <button onClick={handleEdit} style={styles.editBtn}>Edit Profile</button>
          )}
        </div>

        <div style={styles.body}>
          {isEditing ? (
            <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }} noValidate>
              {/* Full Name */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Full Name <span style={styles.required}>*</span></label>
                <input type="text" name="fullName" value={updatedData?.fullName || ''} onChange={handleChange} style={styles.input} />
                {formErrors.fullName && <p style={styles.errorText}>{formErrors.fullName}</p>}
              </div>

              {/* DOB */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Date of Birth <span style={styles.required}>*</span></label>
                <input type="date" name="dob" value={updatedData?.dob?.split('T')[0] || ''} onChange={handleChange} style={styles.input} />
                {formErrors.dob && <p style={styles.errorText}>{formErrors.dob}</p>}
              </div>

              {/* Address */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Address <span style={styles.required}>*</span></label>
                <input type="text" name="address" value={updatedData?.address || ''} onChange={handleChange} style={styles.input} />
                {formErrors.address && <p style={styles.errorText}>{formErrors.address}</p>}
              </div>

              {/* Phone */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Phone Number <span style={styles.required}>*</span></label>
                <input type="tel" name="phone" value={updatedData?.phone || ''} onChange={handleChange} style={styles.input} />
                {formErrors.phone && <p style={styles.errorText}>{formErrors.phone}</p>}
              </div>

              {/* Class Status */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Class Student Status <span style={styles.required}>*</span></label>
                <div style={styles.radioGroup}>
                  <label><input type="radio" name="isClassStudent" value="yes" checked={updatedData?.isClassStudent === 'yes'} onChange={handleChange} /> Yes</label>
                  <label><input type="radio" name="isClassStudent" value="no" checked={updatedData?.isClassStudent === 'no'} onChange={handleChange} /> No</label>
                </div>
                {formErrors.isClassStudent && <p style={styles.errorText}>{formErrors.isClassStudent}</p>}
              </div>

              {/* Actions */}
              <div style={styles.actions}>
                <button type="submit" disabled={updating} style={styles.saveBtn}>
                  {updating ? 'Updating...' : 'Save Changes'}
                </button>
                <button type="button" onClick={handleCancel} style={styles.cancelBtn}>Cancel</button>
              </div>
            </form>
          ) : (
            <div style={styles.infoGrid}>
              <div><strong>Full Name:</strong> {studentData?.fullName || 'Not available'}</div>
              <div><strong>User Name:</strong> {studentData?.userName || 'Not available'}</div>
              <div><strong>Date of Birth:</strong> {studentData?.dob ? new Date(studentData.dob).toLocaleDateString() : 'Not available'}</div>
              <div><strong>Address:</strong> {studentData?.address || 'Not available'}</div>
              <div><strong>Phone Number:</strong> {studentData?.phone || 'Not available'}</div>
              <div><strong>Class Student:</strong> {studentData?.isClassStudent === 'yes' ? 'Yes' : 'No'}</div>
              <div><strong>Created At:</strong> {studentData?.createdAt ? new Date(studentData.createdAt).toLocaleDateString() : 'Not available'}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'linear-gradient(to right, #c9d6ff, #e2e2e2)', padding: '20px' },
  card: { background: '#fff', maxWidth: '700px', width: '100%', borderRadius: '16px', padding: '30px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' },
  title: { fontSize: '2rem', fontWeight: '700', color: '#333' },
  editBtn: { padding: '8px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' },
  body: { fontSize: '1rem', color: '#333' },
  formGroup: { marginBottom: '18px', display: 'flex', flexDirection: 'column' },
  label: { fontWeight: '600', marginBottom: '6px', color: '#444' },
  required: { color: 'red' },
  input: { padding: '10px 12px', border: '1px solid #ccc', borderRadius: '8px', fontSize: '1rem', outline: 'none' },
  radioGroup: { display: 'flex', gap: '20px', marginTop: '5px' },
  actions: { display: 'flex', gap: '10px', marginTop: '20px' },
  saveBtn: { flex: 1, padding: '12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' },
  cancelBtn: { flex: 1, padding: '12px', background: '#f3f4f6', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' },
  infoGrid: { display: 'grid', gridTemplateColumns: '1fr', gap: '12px' },
  errorText: { fontSize: '0.9rem', color: '#dc2626', marginTop: '5px' },
  centerText: { textAlign: 'center', fontSize: '1.2rem', color: '#555', padding: '50px' }
};

export default StudentProfile;
