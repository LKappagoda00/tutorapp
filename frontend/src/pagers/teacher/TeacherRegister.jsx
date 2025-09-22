import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TeacherRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    userName: '',
    nic: '',
    subject: '',
    about: '',
    bankName: '',
    accountNumber: '',
    branch: '',
    beneficiaryName: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    // Prepare data for API
    const payload = {
      fullName: form.fullName,
      userName: form.userName,
      nic: form.nic,
      subject: form.subject,
      about: form.about,
      bankName: form.bankName,
      accountNumber: form.accountNumber,
      branch: form.branch,
      beneficiaryName: form.beneficiaryName,
      password: form.password,
      confirmPassword: form.confirmPassword,
      role: 'teacher',
    };

    try {
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok) {
        navigate('/login'); // Go to login page
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200">
      <div className="relative w-full max-w-lg">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-blue-400 via-purple-400 to-pink-400 blur-2xl opacity-40 animate-pulse"></div>
        <div className="relative z-10 flex flex-col items-center p-10 shadow-2xl bg-white/90 backdrop-blur-xl rounded-3xl animate-fade-in">
          <h2 className="mb-6 text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 drop-shadow-lg">Teacher Register</h2>
          <form className="flex flex-col w-full gap-5" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 mb-2 text-center text-red-700 bg-red-100 border border-red-400 rounded-lg">
                {error}
              </div>
            )}
            <div>
              <label className="block mb-2 font-semibold text-gray-700" htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={form.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2 transition border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your full name"
                required
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold text-gray-700" htmlFor="userName">User Name</label>
              <input
                id="userName"
                name="userName"
                type="text"
                value={form.userName}
                onChange={handleChange}
                className="w-full px-4 py-2 transition border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your user name"
                required
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold text-gray-700" htmlFor="nic">NIC</label>
              <input
                id="nic"
                name="nic"
                type="text"
                value={form.nic}
                onChange={handleChange}
                className="w-full px-4 py-2 transition border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your NIC"
                required
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold text-gray-700" htmlFor="subject">Subject</label>
              <input
                id="subject"
                name="subject"
                type="text"
                value={form.subject}
                onChange={handleChange}
                className="w-full px-4 py-2 transition border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your subject"
                required
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold text-gray-700" htmlFor="about">About</label>
              <textarea
                id="about"
                name="about"
                value={form.about}
                onChange={handleChange}
                className="w-full px-4 py-2 transition border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Tell us about yourself"
                rows={3}
                required
              />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-2 font-semibold text-gray-700" htmlFor="bankName">Bank Name</label>
                <input
                  id="bankName"
                  name="bankName"
                  type="text"
                  value={form.bankName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 transition border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Bank name"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700" htmlFor="accountNumber">Account Number</label>
                <input
                  id="accountNumber"
                  name="accountNumber"
                  type="text"
                  value={form.accountNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 transition border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Account number"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700" htmlFor="branch">Branch</label>
                <input
                  id="branch"
                  name="branch"
                  type="text"
                  value={form.branch}
                  onChange={handleChange}
                  className="w-full px-4 py-2 transition border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Branch"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700" htmlFor="beneficiaryName">Beneficiary Name</label>
                <input
                  id="beneficiaryName"
                  name="beneficiaryName"
                  type="text"
                  value={form.beneficiaryName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 transition border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Beneficiary name"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block mb-2 font-semibold text-gray-700" htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-2 transition border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-pink-400"
                placeholder="Enter your password"
                required
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold text-gray-700" htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 transition border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-pink-400"
                placeholder="Confirm your password"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition-transform duration-200 text-lg tracking-wide mt-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
