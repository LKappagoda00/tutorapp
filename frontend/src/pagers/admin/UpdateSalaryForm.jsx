import React, { useState, useEffect } from 'react';
import Header from '../../components/Header.jsx';
import Footer from '../../components/Footer.jsx';
import Sidebar from '../../components/Sidebar.jsx';
import { useNavigate, useParams } from 'react-router-dom';

export default function UpdateSalaryForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    teacherName: '',
    studentName: '',
    classId: '',
    subject: '',
    courseName: '',
    amount: '',
    status: 'pending',
    notes: '',
    paymentDate: ''
  });

  // Fetch payment data when component mounts
  useEffect(() => {
    if (id) {
      fetchPaymentData();
    }
  }, [id]);

  const fetchPaymentData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/payments/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const payment = await response.json();
        console.log('Fetched payment:', payment);
        
        setFormData({
          teacherName: payment.teacher?.fullName || payment.teacher?.userName || 'N/A',
          studentName: payment.student?.fullName || payment.student?.userName || 'N/A',
          classId: payment.classId || '',
          subject: payment.subject || '',
          courseName: payment.courseName || '',
          amount: payment.amount || '',
          status: payment.status || 'pending',
          notes: payment.notes || '',
          paymentDate: payment.paymentDate ? new Date(payment.paymentDate).toISOString().split('T')[0] : ''
        });
      } else {
        throw new Error('Failed to fetch payment data');
      }
    } catch (error) {
      console.error('Error fetching payment:', error);
      setError('Failed to load payment data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.classId.trim()) {
      setError('Class ID is required');
      return false;
    }
    if (!formData.subject.trim()) {
      setError('Subject is required');
      return false;
    }
    if (!formData.courseName.trim()) {
      setError('Course name is required');
      return false;
    }
    if (!formData.amount || formData.amount <= 0) {
      setError('Valid amount is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    setError('');
    
    try {
      const updateData = {
        classId: formData.classId,
        subject: formData.subject,
        courseName: formData.courseName,
        amount: parseFloat(formData.amount),
        status: formData.status,
        notes: formData.notes,
        paymentDate: formData.paymentDate || new Date().toISOString()
      };

      const response = await fetch(`http://localhost:5000/api/payments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        const updatedPayment = await response.json();
        console.log('Payment updated successfully:', updatedPayment);
        
        setSuccess('Payment updated successfully!');
        
        // Navigate back to salary management after a short delay
        setTimeout(() => {
          const returnUrl = localStorage.getItem('salaryManagementReturnUrl') || '/admin-salary';
          localStorage.removeItem('salaryManagementReturnUrl');
          localStorage.removeItem('updatingPaymentId');
          navigate(returnUrl);
        }, 1500);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update payment');
      }
    } catch (error) {
      console.error('Error updating payment:', error);
      setError(error.message || 'Failed to update payment. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    const returnUrl = localStorage.getItem('salaryManagementReturnUrl') || '/admin-salary';
    localStorage.removeItem('salaryManagementReturnUrl');
    localStorage.removeItem('updatingPaymentId');
    navigate(returnUrl);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200">
        <Header />
        <div className="flex flex-1">
          <Sidebar role="admin" />
          <main className="flex-1 flex flex-col items-center justify-center py-10">
            <div className="bg-white/90 rounded-2xl shadow-xl p-8 w-full max-w-2xl text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading payment data...</p>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200">
      <Header />
      <div className="flex flex-1">
        <Sidebar role="admin" />
        <main className="flex-1 flex flex-col items-center justify-center py-10">
          <div className="bg-white/90 rounded-2xl shadow-xl p-8 w-full max-w-2xl">
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-2 drop-shadow-lg">
                Update Salary Payment
              </h2>
              <p className="text-gray-600 text-sm">
                Modify payment details for ID: {id}
              </p>
            </div>

            {/* Alert Messages */}
            {error && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            {success && (
              <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {success}
                </div>
              </div>
            )}

            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              {/* Read-only fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-semibold text-gray-700">Teacher Name</label>
                  <input 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed" 
                    value={formData.teacherName}
                    readOnly 
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-gray-700">Student Name</label>
                  <input 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed" 
                    value={formData.studentName}
                    readOnly 
                  />
                </div>
              </div>

              {/* Editable fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-semibold text-gray-700">Class ID *</label>
                  <input 
                    name="classId"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow" 
                    placeholder="e.g. CL001"
                    value={formData.classId}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-gray-700">Subject *</label>
                  <input 
                    name="subject"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow" 
                    placeholder="e.g. Mathematics"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 font-semibold text-gray-700">Course Name *</label>
                <input 
                  name="courseName"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow" 
                  placeholder="e.g. Advanced Mathematics"
                  value={formData.courseName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-semibold text-gray-700">Amount *</label>
                  <input 
                    name="amount"
                    type="number" 
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow" 
                    placeholder="Enter amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-gray-700">Payment Date</label>
                  <input 
                    name="paymentDate"
                    type="date" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow"
                    value={formData.paymentDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 font-semibold text-gray-700">Status</label>
                <select 
                  name="status"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 font-semibold text-gray-700">Notes</label>
                <textarea 
                  name="notes"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow" 
                  placeholder="Additional notes (optional)"
                  rows="3"
                  value={formData.notes}
                  onChange={handleInputChange}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 py-3 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-xl shadow-lg transition-all text-lg tracking-wide"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-extrabold rounded-xl shadow-lg hover:scale-105 transition-all text-lg tracking-wide disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  disabled={saving}
                >
                  {saving ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Updating...
                    </div>
                  ) : (
                    'Update Payment'
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
