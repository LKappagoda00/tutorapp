
import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Sidebar from '../../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

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

  const exportStaff = () => {
    const staffHeaders = [
      { key: 'fullName', label: 'Full Name' },
      { key: 'role', label: 'Role' }
    ];
    const staffData = users.filter(user => ['admin', 'library', 'manager'].includes(user.role));
    exportToExcel(staffData, 'Staff_Report', staffHeaders);
  };
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200">
      <Header />
      <div className="flex-grow flex flex-row">
        <Sidebar role="admin" />
        <div className="flex-grow flex flex-col items-center justify-start py-8 overflow-y-auto">
          <div className="bg-white/90 rounded-2xl shadow-xl p-8 w-full max-w-6xl">
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-6 drop-shadow-lg">User Management</h2>
            
            {loading ? (
              <div className="text-center">Loading users...</div>
            ) : error ? (
              <div className="text-red-500 text-center">{error}</div>
            ) : (
              <div className="space-y-8">
                {/* Teachers Table */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-purple-600">Teachers</h3>
                    <button
                      onClick={exportTeachers}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold shadow hover:bg-purple-700 transition-all flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      Export Teachers
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-center">
                      <thead className="bg-purple-100">
                        <tr>
                          <th className="py-2 px-3">Full Name</th>
                          <th className="py-2 px-3">NIC</th>
                          <th className="py-2 px-3">Subject</th>
                          <th className="py-2 px-3">Bank Name</th>
                          <th className="py-2 px-3">Account Number</th>
                          <th className="py-2 px-3">Branch</th>
                          <th className="py-2 px-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.filter(user => user.role === 'teacher').map(teacher => (
                          <tr key={teacher._id} className="hover:bg-purple-50">
                            <td className="py-2 px-3">{teacher.fullName}</td>
                            <td className="py-2 px-3">{teacher.nic}</td>
                            <td className="py-2 px-3">{teacher.subject}</td>
                            <td className="py-2 px-3">{teacher.bankName}</td>
                            <td className="py-2 px-3">{teacher.accountNumber}</td>
                            <td className="py-2 px-3">{teacher.branch}</td>
                            <td className="py-2 px-3 flex gap-2 justify-center">
                              <button
                                className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold shadow hover:scale-105 transition-all"
                                onClick={() => navigate(`/update-user/${teacher._id}`)}
                              >
                                Update
                              </button>
                              <button 
                                className="px-3 py-1 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg font-semibold shadow hover:scale-105 transition-all"
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
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-blue-600">Students</h3>
                    <button
                      onClick={exportStudents}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition-all flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      Export Students
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-center">
                      <thead className="bg-blue-100">
                        <tr>
                          <th className="py-2 px-3">Full Name</th>
                          <th className="py-2 px-3">Username</th>
                          <th className="py-2 px-3">Date of Birth</th>
                          <th className="py-2 px-3">Address</th>
                          <th className="py-2 px-3">Phone</th>
                          <th className="py-2 px-3">Class Student</th>
                          <th className="py-2 px-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.filter(user => user.role === 'student').map(student => (
                          <tr key={student._id} className="hover:bg-blue-50">
                            <td className="py-2 px-3">{student.fullName}</td>
                            <td className="py-2 px-3">{student.userName}</td>
                            <td className="py-2 px-3">{new Date(student.dob).toLocaleDateString()}</td>
                            <td className="py-2 px-3">{student.address}</td>
                            <td className="py-2 px-3">{student.phone}</td>
                            <td className="py-2 px-3">{student.isClassStudent}</td>
                            <td className="py-2 px-3 flex gap-2 justify-center">
                              <button
                                className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold shadow hover:scale-105 transition-all"
                                onClick={() => navigate(`/update-user/${student._id}`)}
                              >
                                Update
                              </button>
                              <button 
                                className="px-3 py-1 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg font-semibold shadow hover:scale-105 transition-all"
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
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-green-600">Other Staff</h3>
                    <button
                      onClick={exportStaff}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold shadow hover:bg-green-700 transition-all flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      Export Staff
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-center">
                      <thead className="bg-green-100">
                        <tr>
                          <th className="py-2 px-3">Full Name</th>
                          <th className="py-2 px-3">Role</th>
                          <th className="py-2 px-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.filter(user => ['admin', 'library', 'manager'].includes(user.role)).map(staff => (
                          <tr key={staff._id} className="hover:bg-green-50">
                            <td className="py-2 px-3">{staff.fullName}</td>
                            <td className="py-2 px-3 capitalize">{staff.role}</td>
                            <td className="py-2 px-3 flex gap-2 justify-center">
                              <button
                                className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold shadow hover:scale-105 transition-all"
                                onClick={() => navigate(`/update-user/${staff._id}`)}
                              >
                                Update
                              </button>
                              <button 
                                className="px-3 py-1 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg font-semibold shadow hover:scale-105 transition-all"
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

