import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

export default function SalaryTable() {
  const [allPayments, setAllPayments] = useState([]); // Store all payments
  const [filteredPayments, setFilteredPayments] = useState([]); // Store filtered payments
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(''); // Empty means all months
  const [selectedYear, setSelectedYear] = useState(''); // Empty means all years
  const navigate = useNavigate();

  // Fetch all payments when component mounts
  useEffect(() => {
    fetchAllPayments();
  }, []);

  // Filter payments when month/year selection changes
  useEffect(() => {
    filterPayments();
  }, [allPayments, selectedMonth, selectedYear]);

  const fetchAllPayments = async () => {
    try {
      setError(null);
      setLoading(true);
      console.log('Fetching all payments from: http://localhost:5000/api/payments/all-populated');
      const response = await fetch('http://localhost:5000/api/payments/all-populated');
      
      if (response.ok) {
        const data = await response.json();
        console.log('Received all payments:', data.length);
        // Ensure data is an array
        const paymentsArray = Array.isArray(data) ? data : [];
        setAllPayments(paymentsArray);
        setFilteredPayments(paymentsArray); // Initially show all
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch payments:', response.status, errorText);
        setError(`Failed to fetch payments: ${response.status}`);
        setAllPayments([]);
        setFilteredPayments([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching payments:', error);
      setError('Network error while fetching payments');
      setAllPayments([]);
      setFilteredPayments([]);
      setLoading(false);
    }
  };

  const filterPayments = () => {
    if (selectedMonth === '' && selectedYear === '') {
      // No filter applied, show all payments
      setFilteredPayments(allPayments);
      return;
    }

    const filtered = allPayments.filter(payment => {
      const paymentDate = new Date(payment.paymentDate);
      const paymentMonth = paymentDate.getMonth() + 1; // 1-12
      const paymentYear = paymentDate.getFullYear();

      const monthMatch = selectedMonth === '' || paymentMonth === parseInt(selectedMonth);
      const yearMatch = selectedYear === '' || paymentYear === parseInt(selectedYear);

      return monthMatch && yearMatch;
    });

    setFilteredPayments(filtered);
  };

  const updatePaymentStatus = async (paymentId, status) => {
    // Add confirmation for status changes
    const payment = allPayments.find(p => p._id === paymentId);
    const currentStatus = payment?.status || 'unknown';
    
    if (currentStatus === status) {
      return; // No change needed
    }
    
    const confirmMsg = status === 'completed' 
      ? `Mark payment as completed? This will calculate commission (15% admin, 85% teacher).`
      : status === 'failed'
      ? `Mark payment as failed? This action can be reversed later.`
      : `Change status to pending?`;
    
    if (!window.confirm(confirmMsg)) {
      return;
    }

    setUpdating(paymentId);
    try {
      const response = await fetch(`http://localhost:5000/api/payments/${paymentId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      
      if (response.ok) {
        const updatedPayment = await response.json();
        // Update both allPayments and filteredPayments
        setAllPayments(allPayments.map(payment => 
          payment._id === paymentId ? updatedPayment : payment
        ));
        setFilteredPayments(filteredPayments.map(payment => 
          payment._id === paymentId ? updatedPayment : payment
        ));
        
        // Show success message
        const statusMsg = status === 'completed' ? 'completed with commission calculated' : status;
        alert(`Payment status updated to ${statusMsg} successfully!`);
      } else {
        throw new Error('Failed to update payment status');
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
      alert('Failed to update payment status. Please try again.');
    }
    setUpdating(null);
  };

  const handleUpdatePayment = (paymentId) => {
    // Store the current location and payment ID in localStorage for navigation back
    localStorage.setItem('salaryManagementReturnUrl', window.location.pathname);
    localStorage.setItem('updatingPaymentId', paymentId);
    navigate(`/update-salary/${paymentId}`);
  };

  const handleDownloadExcel = () => {
    // Prepare data for Excel
    const data = filteredPayments.map(payment => ({
      Student: payment.student?.fullName || payment.student?.userName || '-',
      Teacher: payment.teacher?.fullName || payment.teacher?.userName || '-',
      Subject: payment.teacher?.subject || '-',
      Amount: payment.amount,
      TeacherShare: payment.teacherAmount || '0',
      AdminShare: payment.adminAmount || '0',
      PaymentDate: payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : '-',
      Status: payment.status || 'pending',
      Note: payment.note || '-'
    }));
    
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Salary Report');
    
    // Generate filename with current date and filters
    const today = new Date().toISOString().split('T')[0];
    const monthFilter = selectedMonth ? months.find(m => m.value == selectedMonth)?.label : 'All';
    const yearFilter = selectedYear || 'All';
    const filename = `salary_report_${monthFilter}_${yearFilter}_${today}.xlsx`;
    
    XLSX.writeFile(workbook, filename);
  };

  // Generate month options
  const months = [
    { value: '', label: 'All Months' },
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  // Generate year options (current year and 2 years back)
  const currentYear = new Date().getFullYear();
  const years = [{ value: '', label: 'All Years' }];
  for (let i = currentYear; i >= currentYear - 2; i--) {
    years.push({ value: i, label: i.toString() });
  }

  const clearFilters = () => {
    setSelectedMonth('');
    setSelectedYear('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-lg text-gray-600">Loading salary data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      {/* Header Section */}
      <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
        <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center">
          <div>
            <h3 className="mb-2 text-2xl font-bold text-gray-800">Salary Management</h3>
            <p className="text-sm text-gray-600">Manage and track payment statuses for all teachers</p>
          </div>
          
          {/* Filter Controls */}
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Month:</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Year:</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {years.map((year) => (
                  <option key={year.value} value={year.value}>
                    {year.label}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm font-medium text-white transition-colors bg-gray-500 rounded-md hover:bg-gray-600 whitespace-nowrap"
            >
              Clear Filters
            </button>
            
            <button
              onClick={handleDownloadExcel}
              disabled={filteredPayments.length === 0}
              className="px-4 py-2 text-sm font-medium text-white transition-colors bg-green-500 rounded-md hover:bg-green-600 whitespace-nowrap disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Download Report
            </button>
          </div>
        </div>
        
        {/* Statistics Row */}
        <div className="pt-4 mt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{filteredPayments.length}</div>
              <div className="text-xs text-gray-600">Showing</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-700">{allPayments.length}</div>
              <div className="text-xs text-gray-600">Total Payments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {filteredPayments.filter(p => p.status === 'completed').length}
              </div>
              <div className="text-xs text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {filteredPayments.filter(p => p.status === 'pending').length}
              </div>
              <div className="text-xs text-gray-600">Pending</div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Legend */}
      <div className="p-4 mb-6 bg-white rounded-lg shadow-md">
        <h4 className="mb-3 text-sm font-semibold text-gray-700">Status Legend:</h4>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400 rounded"></div>
            <span className="text-sm text-gray-600">Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-600">Completed (Commission Applied)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm text-gray-600">Failed</span>
          </div>
        </div>
      </div>

      {/* Main Table Section */}
      {loading ? (
        <div className="p-8 bg-white rounded-lg shadow-md">
          <div className="flex items-center justify-center">
            <div className="w-12 h-12 border-b-2 border-purple-600 rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-600">Loading payments...</span>
          </div>
        </div>
      ) : filteredPayments.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-lg shadow-md">
          <div className="text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mb-2 text-lg font-medium text-gray-900">No payments found</h3>
            <p className="text-gray-500">
              {selectedMonth !== 'all' || selectedYear !== 'all' ? 
                'No payment records found for the selected filters. Try adjusting your search criteria.' : 
                'No payment records available in the system.'
              }
            </p>
            {(selectedMonth !== 'all' || selectedYear !== 'all') && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 mt-4 text-sm text-white transition-colors bg-purple-600 rounded-md hover:bg-purple-700"
              >
                View All Payments
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-lg">
          <table className="w-full bg-white border-collapse">
            <thead>
              <tr className="text-white bg-gradient-to-r from-purple-600 to-blue-600">
                <th className="px-3 py-4 font-semibold text-left" style={{width: "4%"}}>No</th>
                <th className="px-3 py-4 font-semibold text-left" style={{width: "12%"}}>Teacher</th>
                <th className="px-3 py-4 font-semibold text-left" style={{width: "12%"}}>Student</th>
                <th className="px-3 py-4 font-semibold text-left" style={{width: "8%"}}>Class ID</th>
                <th className="px-3 py-4 font-semibold text-left" style={{width: "10%"}}>Subject</th>
                <th className="px-3 py-4 font-semibold text-right" style={{width: "10%"}}>Amount</th>
                <th className="px-3 py-4 font-semibold text-right" style={{width: "8%"}}>Admin (15%)</th>
                <th className="px-3 py-4 font-semibold text-right" style={{width: "8%"}}>Teacher Pay</th>
                <th className="px-3 py-4 font-semibold text-center" style={{width: "10%"}}>Status</th>
                <th className="px-3 py-4 font-semibold text-center" style={{width: "8%"}}>Date</th>
                <th className="px-3 py-4 font-semibold text-left" style={{width: "12%"}}>Bank Details</th>
                <th className="px-3 py-4 font-semibold text-center" style={{width: "8%"}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment, idx) => (
                <tr key={payment._id} className={`border-b hover:bg-gray-50 transition-colors ${
                  payment.status === 'completed' ? 'border-l-4 border-green-500' : 
                  payment.status === 'failed' ? 'border-l-4 border-red-500' : 
                  'border-l-4 border-yellow-500'
                }`}>
                  {/* Row Number */}
                  <td className="px-3 py-4 font-bold text-gray-700" style={{width: "4%"}}>
                    {idx + 1}
                  </td>
                  
                  {/* Teacher */}
                  <td className="px-3 py-4" style={{width: "12%"}}>
                    <div className="text-sm font-semibold text-blue-700 truncate" title={payment.teacher?.fullName || 'N/A'}>
                      {payment.teacher?.fullName || 'N/A'}
                    </div>
                    <div className="text-xs text-gray-600 truncate" title={payment.teacher?.subject || 'N/A'}>
                      {payment.teacher?.subject || 'N/A'}
                    </div>
                  </td>

                  {/* Student */}
                  <td className="px-3 py-4" style={{width: "12%"}}>
                    <div className="text-sm font-medium truncate" title={payment.student?.fullName || 'N/A'}>
                      {payment.student?.fullName || 'N/A'}
                    </div>
                  </td>

                  {/* Class ID */}
                  <td className="px-3 py-4" style={{width: "8%"}}>
                    <div className="px-2 py-1 font-mono text-xs truncate bg-gray-100 rounded" title={payment.classId}>
                      {payment.classId}
                    </div>
                  </td>

                  {/* Subject */}
                  <td className="px-3 py-4" style={{width: "10%"}}>
                    <div className="text-sm truncate" title={payment.subject}>
                      {payment.subject}
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="px-3 py-4 text-right" style={{width: "10%"}}>
                    <div className="text-sm font-bold text-green-600">
                      Rs. {payment.amount.toLocaleString()}
                    </div>
                  </td>

                  {/* Admin Commission */}
                  <td className="px-3 py-4 text-right" style={{width: "8%"}}>
                    <div className="text-sm font-medium text-purple-600">
                      Rs. {(payment.adminCommission || 0).toLocaleString()}
                    </div>
                  </td>

                  {/* Teacher Payment */}
                  <td className="px-3 py-4 text-right" style={{width: "8%"}}>
                    <div className="text-sm font-medium text-blue-600">
                      Rs. {(payment.teacherPayment || 0).toLocaleString()}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-3 py-4 text-center" style={{width: "10%"}}>
                    <select
                      value={payment.status}
                      onChange={(e) => updatePaymentStatus(payment._id, e.target.value)}
                      disabled={updating === payment._id}
                      className={`w-full px-2 py-1 rounded border text-xs font-medium ${
                        payment.status === 'completed' ? 'bg-green-100 text-green-800 border-green-300' :
                        payment.status === 'failed' ? 'bg-red-100 text-red-800 border-red-300' :
                        'bg-yellow-100 text-yellow-800 border-yellow-300'
                      } ${updating === payment._id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="failed">Failed</option>
                    </select>
                  </td>

                  {/* Date */}
                  <td className="px-3 py-4 text-center" style={{width: "8%"}}>
                    <div className="text-xs text-gray-600">
                      {new Date(payment.paymentDate).toLocaleDateString('en-GB')}
                    </div>
                  </td>

                  {/* Bank Details */}
                  <td className="px-3 py-4" style={{width: "12%"}}>
                    <div className="space-y-1 text-xs text-gray-700">
                      <div className="truncate" title={payment.teacher?.bankName || 'N/A'}>
                        <span className="font-semibold">Bank:</span> {payment.teacher?.bankName || 'N/A'}
                      </div>
                      <div className="truncate" title={payment.teacher?.accountNumber || 'N/A'}>
                        <span className="font-semibold">Acc:</span> {payment.teacher?.accountNumber || 'N/A'}
                      </div>
                      <div className="truncate" title={payment.teacher?.branch || 'N/A'}>
                        <span className="font-semibold">Branch:</span> {payment.teacher?.branch || 'N/A'}
                      </div>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-3 py-4 text-center" style={{width: "8%"}}>
                    <button
                      onClick={() => handleUpdatePayment(payment._id)}
                      className="relative px-3 py-2 text-xs font-medium text-white transition-all duration-200 transform rounded-md shadow-md group bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 hover:scale-105 hover:shadow-lg"
                      title="Update payment details"
                    >
                      <svg className="inline-block w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
     
    </div>
  );
}    