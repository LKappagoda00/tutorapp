
import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Sidebar from '../../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

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

  const fetchUsers = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        setError('Not authenticated. Please login again.');
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:5000/api/users', {
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
        setUsers(data);
      } else {
        setError(data.error || 'Failed to fetch users');
      }
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const token = getAuthToken();
      if (!token) {
        setError('Not authenticated. Please login again.');
        navigate('/login');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'DELETE',
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

      if (response.ok) {
        fetchUsers(); // Refresh the list
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete user');
      }
    } catch (err) {
      setError('Error connecting to server');
    }
  };

  const exportToExcel = (data, fileName, headers) => {
    // Convert data to worksheet format
    const worksheet = XLSX.utils.json_to_sheet(data.map(item => {
      const row = {};
      headers.forEach(header => {
        if (header.key === 'dob') {
          row[header.label] = item[header.key] ? new Date(item[header.key]).toLocaleDateString() : '';
        } else {
          row[header.label] = item[header.key];
        }
      });
      return row;
    }));

    // Create workbook and add worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const exportToPDF = (data, fileName, headers, title) => {
    const doc = new jsPDF('l', 'mm', 'a4'); // landscape orientation for better table fit
    
    // Add title
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text(title, doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
    
    // Add date
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 35);
    
    // Prepare table data
    const tableData = data.map(item => 
      headers.map(header => {
        if (header.key === 'dob') {
          return item[header.key] ? new Date(item[header.key]).toLocaleDateString() : '';
        }
        return item[header.key] || '';
      })
    );
    
    // Add table
    autoTable(doc, {
      head: [headers.map(header => header.label)],
      body: tableData,
      startY: 45,
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [63, 81, 181],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240]
      },
      margin: { top: 45, left: 10, right: 10 },
      columnStyles: {
        0: { cellWidth: 'auto' },
      }
    });
    
    // Add footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
    }
    
    // Save the PDF
    doc.save(`${fileName}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const exportTeachers = () => {
    const teacherHeaders = [
      { key: 'fullName', label: 'Full Name' },
      { key: 'nic', label: 'NIC' },
      { key: 'subject', label: 'Subject' },
      { key: 'bankName', label: 'Bank Name' },
      { key: 'accountNumber', label: 'Account Number' },
      { key: 'branch', label: 'Branch' },
      { key: 'beneficiaryName', label: 'Beneficiary Name' }
    ];
    const teacherData = users.filter(user => user.role === 'teacher');
    exportToExcel(teacherData, 'Teachers_Report', teacherHeaders);
  };

  const exportTeachersToPDF = () => {
    const teacherHeaders = [
      { key: 'fullName', label: 'Full Name' },
      { key: 'nic', label: 'NIC' },
      { key: 'subject', label: 'Subject' },
      { key: 'bankName', label: 'Bank Name' },
      { key: 'accountNumber', label: 'Account Number' },
      { key: 'branch', label: 'Branch' },
      { key: 'beneficiaryName', label: 'Beneficiary Name' }
    ];
    const teacherData = users.filter(user => user.role === 'teacher');
    exportToPDF(teacherData, 'Teachers_Report', teacherHeaders, 'Teachers Report');
  };

  const exportStudents = () => {
    const studentHeaders = [
      { key: 'fullName', label: 'Full Name' },
      { key: 'userName', label: 'Username' },
      { key: 'dob', label: 'Date of Birth' },
      { key: 'address', label: 'Address' },
      { key: 'phone', label: 'Phone' },
      { key: 'isClassStudent', label: 'Class Student' }
    ];
    const studentData = users.filter(user => user.role === 'student');
    exportToExcel(studentData, 'Students_Report', studentHeaders);
  };

  const exportStudentsToPDF = () => {
    const studentHeaders = [
      { key: 'fullName', label: 'Full Name' },
      { key: 'userName', label: 'Username' },
      { key: 'dob', label: 'Date of Birth' },
      { key: 'address', label: 'Address' },
      { key: 'phone', label: 'Phone' },
      { key: 'isClassStudent', label: 'Class Student' }
    ];
    const studentData = users.filter(user => user.role === 'student');
    exportToPDF(studentData, 'Students_Report', studentHeaders, 'Students Report');
  };

  const exportStaff = () => {
    const staffHeaders = [
      { key: 'fullName', label: 'Full Name' },
      { key: 'role', label: 'Role' }
    ];
    const staffData = users.filter(user => ['admin', 'library', 'manager'].includes(user.role));
    exportToExcel(staffData, 'Staff_Report', staffHeaders);
  };

  const exportStaffToPDF = () => {
    const staffHeaders = [
      { key: 'fullName', label: 'Full Name' },
      { key: 'role', label: 'Role' }
    ];
    const staffData = users.filter(user => ['admin', 'library', 'manager'].includes(user.role));
    exportToPDF(staffData, 'Staff_Report', staffHeaders, 'Staff Report');
  };
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200">
      <Header />
      <div className="flex flex-row flex-grow">
        <Sidebar role="admin" />
        <div className="flex flex-col items-center justify-start flex-grow py-8 overflow-y-auto">
          <div className="w-full max-w-6xl p-8 shadow-xl bg-white/90 rounded-2xl">
            <h2 className="mb-6 text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 drop-shadow-lg">User Management</h2>
            
            {loading ? (
              <div className="text-center">Loading users...</div>
            ) : error ? (
              <div className="text-center text-red-500">{error}</div>
            ) : (
              <div className="space-y-8">
                {/* Teachers Table */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-purple-600">Teachers</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={exportTeachers}
                        className="flex items-center gap-2 px-4 py-2 font-semibold text-white transition-all bg-purple-600 rounded-lg shadow hover:bg-purple-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Export Excel
                      </button>
                      <button
                        onClick={exportTeachersToPDF}
                        className="flex items-center gap-2 px-4 py-2 font-semibold text-white transition-all bg-red-600 rounded-lg shadow hover:bg-red-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Export PDF
                      </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-center">
                      <thead className="bg-purple-100">
                        <tr>
                          <th className="px-3 py-2">Full Name</th>
                          <th className="px-3 py-2">NIC</th>
                          <th className="px-3 py-2">Subject</th>
                          <th className="px-3 py-2">Bank Name</th>
                          <th className="px-3 py-2">Account Number</th>
                          <th className="px-3 py-2">Branch</th>
                          <th className="px-3 py-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.filter(user => user.role === 'teacher').map(teacher => (
                          <tr key={teacher._id} className="hover:bg-purple-50">
                            <td className="px-3 py-2">{teacher.fullName}</td>
                            <td className="px-3 py-2">{teacher.nic}</td>
                            <td className="px-3 py-2">{teacher.subject}</td>
                            <td className="px-3 py-2">{teacher.bankName}</td>
                            <td className="px-3 py-2">{teacher.accountNumber}</td>
                            <td className="px-3 py-2">{teacher.branch}</td>
                            <td className="flex justify-center gap-2 px-3 py-2">
                              <button
                                className="px-3 py-1 font-semibold text-white transition-all rounded-lg shadow bg-gradient-to-r from-blue-500 to-purple-500 hover:scale-105"
                                onClick={() => navigate(`/update-user/${teacher._id}`)}
                              >
                                Update
                              </button>
                              <button 
                                className="px-3 py-1 font-semibold text-white transition-all rounded-lg shadow bg-gradient-to-r from-pink-500 to-red-500 hover:scale-105"
                                onClick={() => handleDelete(teacher._id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Students Table */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-blue-600">Students</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={exportStudents}
                        className="flex items-center gap-2 px-4 py-2 font-semibold text-white transition-all bg-blue-600 rounded-lg shadow hover:bg-blue-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Export Excel
                      </button>
                      <button
                        onClick={exportStudentsToPDF}
                        className="flex items-center gap-2 px-4 py-2 font-semibold text-white transition-all bg-red-600 rounded-lg shadow hover:bg-red-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Export PDF
                      </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-center">
                      <thead className="bg-blue-100">
                        <tr>
                          <th className="px-3 py-2">Full Name</th>
                          <th className="px-3 py-2">Username</th>
                          <th className="px-3 py-2">Date of Birth</th>
                          <th className="px-3 py-2">Address</th>
                          <th className="px-3 py-2">Phone</th>
                          <th className="px-3 py-2">Class Student</th>
                          <th className="px-3 py-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.filter(user => user.role === 'student').map(student => (
                          <tr key={student._id} className="hover:bg-blue-50">
                            <td className="px-3 py-2">{student.fullName}</td>
                            <td className="px-3 py-2">{student.userName}</td>
                            <td className="px-3 py-2">{new Date(student.dob).toLocaleDateString()}</td>
                            <td className="px-3 py-2">{student.address}</td>
                            <td className="px-3 py-2">{student.phone}</td>
                            <td className="px-3 py-2">{student.isClassStudent}</td>
                            <td className="flex justify-center gap-2 px-3 py-2">
                              <button
                                className="px-3 py-1 font-semibold text-white transition-all rounded-lg shadow bg-gradient-to-r from-blue-500 to-purple-500 hover:scale-105"
                                onClick={() => navigate(`/update-user/${student._id}`)}
                              >
                                Update
                              </button>
                              <button 
                                className="px-3 py-1 font-semibold text-white transition-all rounded-lg shadow bg-gradient-to-r from-pink-500 to-red-500 hover:scale-105"
                                onClick={() => handleDelete(student._id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Other Staff Table (Admin, Library, Manager) */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-green-600">Other Staff</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={exportStaff}
                        className="flex items-center gap-2 px-4 py-2 font-semibold text-white transition-all bg-green-600 rounded-lg shadow hover:bg-green-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Export Excel
                      </button>
                      <button
                        onClick={exportStaffToPDF}
                        className="flex items-center gap-2 px-4 py-2 font-semibold text-white transition-all bg-red-600 rounded-lg shadow hover:bg-red-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Export PDF
                      </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-center">
                      <thead className="bg-green-100">
                        <tr>
                          <th className="px-3 py-2">Full Name</th>
                          <th className="px-3 py-2">Role</th>
                          <th className="px-3 py-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.filter(user => ['admin', 'library', 'manager'].includes(user.role)).map(staff => (
                          <tr key={staff._id} className="hover:bg-green-50">
                            <td className="px-3 py-2">{staff.fullName}</td>
                            <td className="px-3 py-2 capitalize">{staff.role}</td>
                            <td className="flex justify-center gap-2 px-3 py-2">
                              <button
                                className="px-3 py-1 font-semibold text-white transition-all rounded-lg shadow bg-gradient-to-r from-blue-500 to-purple-500 hover:scale-105"
                                onClick={() => navigate(`/update-user/${staff._id}`)}
                              >
                                Update
                              </button>
                              <button 
                                className="px-3 py-1 font-semibold text-white transition-all rounded-lg shadow bg-gradient-to-r from-pink-500 to-red-500 hover:scale-105"
                                onClick={() => handleDelete(staff._id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

