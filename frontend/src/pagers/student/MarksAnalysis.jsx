import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Sidebar from '../../components/Sidebar';
import StudentProfile from './studentprofile.jsx';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function MarksAnalysis() {
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [animateStats, setAnimateStats] = useState(false);

  const handleDownloadExcel = () => {
    const data = marks.map(m => ({
      Teacher: m.teacher?.fullName || 'N/A',
      Subject: m.teacher?.subject || 'N/A',
      ExamType: m.examType,
      Marks: m.marks,
      Date: m.date ? new Date(m.date).toLocaleDateString() : '',
      Note: m.specialNote || ''
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'MyMarks');
    XLSX.writeFile(workbook, 'my_marks_report.xlsx');
  };

  // Get student id from localStorage
  const getStudentId = () => {
    try {
      const userRaw = localStorage.getItem('user');
      if (userRaw) {
        const userObj = JSON.parse(userRaw);
        return userObj.id || userObj._id || '';
      }
    } catch {}
    return '';
  };

  const studentId = getStudentId();

  // Fetch teachers list
  useEffect(() => {
    fetch('http://localhost:5000/api/users?role=teacher')
      .then(res => res.json())
      .then(data => {
        setTeachers(data);
        setLoadingTeachers(false);
      })
      .catch(() => {
        setLoadingTeachers(false);
      });
  }, []);

  // Fetch marks based on selected teacher
  useEffect(() => {
    if (!studentId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const url = selectedTeacher
      ? `http://localhost:5000/api/marks/teacher/${selectedTeacher}/student/${studentId}`
      : `http://localhost:5000/api/marks/student/${studentId}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setMarks(data);
        setLoading(false);
        setTimeout(() => setAnimateStats(true), 300);
      })
      .catch(error => {
        console.error('Error fetching marks:', error);
        setLoading(false);
      });
  }, [studentId, selectedTeacher]);

  // Prepare chart data (unchanged)
  const chartData = {
    labels: marks.map(m => `${m.teacher?.subject || 'N/A'} (${m.examType})`),
    datasets: [
      {
        label: 'Marks',
        data: marks.map(m => m.marks),
        backgroundColor: marks.map(m =>
          m.marks < 45
            ? 'rgba(255, 99, 132, 0.6)' // red
            : m.marks < 60
            ? 'rgba(255, 206, 86, 0.6)' // yellow
            : 'rgba(75, 192, 192, 0.6)' // green
        ),
        borderRadius: 8,
        borderWidth: 2,
        borderColor: marks.map(m =>
          m.marks < 45
            ? 'rgba(255, 99, 132, 0.8)'
            : m.marks < 60
            ? 'rgba(255, 206, 86, 0.8)'
            : 'rgba(75, 192, 192, 0.8)'
        ),
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { 
        display: true, 
        text: 'Marks Analysis (Bar Chart)',
        font: { size: 18, weight: 'bold' },
        color: '#7c3aed',
        padding: { bottom: 30 }
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const note = marks?.[context.dataIndex]?.specialNote;
            return `Marks: ${context.raw}${note ? ` | Note: ${note}` : ''}`;
          },
        },
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#7c3aed',
        borderWidth: 2,
        cornerRadius: 10,
        displayColors: false,
      },
    },
    scales: {
      y: { 
        beginAtZero: true, 
        max: 100,
        grid: { 
          color: 'rgba(124, 58, 237, 0.1)',
          drawBorder: false
        },
        ticks: { 
          color: '#6b7280',
          font: { size: 12, weight: '600' }
        }
      },
      x: {
        grid: { display: false },
        ticks: { 
          color: '#6b7280',
          maxRotation: 45,
          minRotation: 0,
          font: { size: 11, weight: '500' }
        }
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeOutBounce'
    }
  };

  // Calculate stats
  const stats = {
    average: marks.length ? (marks.reduce((sum, m) => sum + m.marks, 0) / marks.length).toFixed(1) : 0,
    highest: marks.length ? Math.max(...marks.map(m => m.marks)) : 0,
    lowest: marks.length ? Math.min(...marks.map(m => m.marks)) : 0,
    passing: marks.filter(m => m.marks >= 50).length,
    total: marks.length,
  };

  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute rounded-full -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-300/20 to-pink-300/20 blur-3xl animate-pulse"></div>
        <div className="absolute rounded-full -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-300/20 to-indigo-300/20 blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute w-64 h-64 transform -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 left-1/2 bg-gradient-to-r from-purple-200/10 to-blue-200/10 blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <Header />
      
      <div className="relative z-10 flex flex-row flex-grow">
        <Sidebar role="student" />
        
        <div className="flex flex-col items-center justify-start flex-grow px-4 py-6 sm:px-6 lg:px-8">
          {/* Enhanced Stats Cards */}
          {marks.length > 0 && (
            <div className="w-full mb-8 max-w-7xl">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 sm:gap-4">
                <div className={`bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl shadow-lg text-white transform transition-all duration-700 hover:scale-105 ${animateStats ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                  <div className="text-center">
                    <div className="text-2xl font-bold sm:text-3xl">{stats.average}%</div>
                    <div className="mt-1 text-xs sm:text-sm opacity-90">Average</div>
                    <div className="mt-2 text-xl">📊</div>
                  </div>
                </div>
                
                <div className={`bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-2xl shadow-lg text-white transform transition-all duration-700 delay-100 hover:scale-105 ${animateStats ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                  <div className="text-center">
                    <div className="text-2xl font-bold sm:text-3xl">{stats.highest}%</div>
                    <div className="mt-1 text-xs sm:text-sm opacity-90">Highest</div>
                    <div className="mt-2 text-xl">🏆</div>
                  </div>
                </div>
                
                <div className={`bg-gradient-to-br from-red-500 to-red-600 p-4 rounded-2xl shadow-lg text-white transform transition-all duration-700 delay-200 hover:scale-105 ${animateStats ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                  <div className="text-center">
                    <div className="text-2xl font-bold sm:text-3xl">{stats.lowest}%</div>
                    <div className="mt-1 text-xs sm:text-sm opacity-90">Lowest</div>
                    <div className="mt-2 text-xl">⚠️</div>
                  </div>
                </div>
                
                <div className={`bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-2xl shadow-lg text-white transform transition-all duration-700 delay-300 hover:scale-105 ${animateStats ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                  <div className="text-center">
                    <div className="text-2xl font-bold sm:text-3xl">{stats.passing}</div>
                    <div className="mt-1 text-xs sm:text-sm opacity-90">Passing</div>
                    <div className="mt-2 text-xl">✅</div>
                  </div>
                </div>
                
                <div className={`bg-gradient-to-br from-indigo-500 to-indigo-600 p-4 rounded-2xl shadow-lg text-white transform transition-all duration-700 delay-400 hover:scale-105 col-span-2 sm:col-span-3 lg:col-span-1 ${animateStats ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                  <div className="text-center">
                    <div className="text-2xl font-bold sm:text-3xl">{stats.total}</div>
                    <div className="mt-1 text-xs sm:text-sm opacity-90">Total Exams</div>
                    <div className="mt-2 text-xl">📚</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Content Card */}
          <div className="w-full overflow-hidden border shadow-2xl max-w-7xl bg-white/80 backdrop-blur-sm rounded-3xl border-white/50">
            <div className="p-6 sm:p-8 lg:p-10">
              <h2 className="mb-8 text-3xl font-black text-center text-transparent sm:text-4xl lg:text-5xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text drop-shadow-lg animate-pulse">
                My Academic Performance
              </h2>
              
              {/* Controls */}
              <div className="flex flex-col gap-4 p-4 mb-8 border border-purple-100 lg:flex-row lg:gap-6 sm:p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl">
                <div className="flex-1">
                  <label htmlFor="teacher" className="block mb-3 text-sm font-bold text-gray-700">
                    🎯 Filter by Teacher
                  </label>
                  <select
                    id="teacher"
                    value={selectedTeacher}
                    onChange={(e) => setSelectedTeacher(e.target.value)}
                    className="block w-full px-4 py-3 text-base transition-all duration-300 bg-white border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-300 focus:border-purple-500 hover:border-purple-300"
                    disabled={loadingTeachers}
                  >
                    <option value="">🌟 All Teachers</option>
                    {teachers.map((teacher) => (
                      <option key={teacher._id} value={teacher._id}>
                        👨‍🏫 {teacher.fullName} - {teacher.subject}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-end">
                  <button
                    className="px-6 py-3 font-bold text-white transition-all duration-300 transform shadow-lg sm:px-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl hover:from-purple-600 hover:to-pink-600 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 active:scale-95"
                    onClick={handleDownloadExcel}
                    disabled={marks.length === 0}
                  >
                    📊 Download Report
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="py-16 text-center">
                  <div className="relative w-24 h-24 mx-auto mb-8">
                    <div className="absolute inset-0 border-4 border-purple-200 rounded-full animate-spin border-t-purple-600"></div>
                    <div className="absolute border-4 border-pink-200 rounded-full inset-3 animate-spin border-t-pink-600" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                  </div>
                  <p className="text-2xl font-bold text-gray-700 animate-pulse">Loading your academic journey...</p>
                </div>
              ) : marks.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="mb-6 text-8xl">📚</div>
                  <p className="mb-2 text-2xl font-bold text-gray-600">No marks found</p>
                  <p className="text-lg text-gray-500">Your academic adventure awaits!</p>
                </div>
              ) : (
                <>
                  {/* Enhanced Bar Chart */}
                  <div className="p-6 mb-12 border border-purple-100 shadow-lg bg-gradient-to-br from-white to-purple-50 rounded-2xl">
                    <div className="h-64 sm:h-80 lg:h-96">
                      <Bar data={chartData} options={chartOptions} />
                    </div>
                  </div>

                  {/* Enhanced Table */}
                  <div className="mb-12 overflow-hidden border border-purple-100 shadow-xl rounded-2xl">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-white bg-gradient-to-r from-purple-600 to-pink-600">
                            <th className="px-3 py-4 text-sm font-bold text-left sm:px-6 sm:text-base">👨‍🏫 Teacher</th>
                            <th className="hidden px-3 py-4 text-sm font-bold text-left sm:px-6 sm:text-base sm:table-cell">📚 Subject</th>
                            <th className="px-3 py-4 text-sm font-bold text-left sm:px-6 sm:text-base">📝 Exam Type</th>
                            <th className="px-3 py-4 text-sm font-bold text-center sm:px-6 sm:text-base">🎯 Marks</th>
                            <th className="hidden px-3 py-4 text-sm font-bold text-left sm:px-6 sm:text-base md:table-cell">📅 Date</th>
                            <th className="hidden px-3 py-4 text-sm font-bold text-left sm:px-6 sm:text-base lg:table-cell">💬 Note</th>
                          </tr>
                        </thead>
                        <tbody>
                          {marks.map((m, i) => (
                            <tr key={m._id || i} className={`transition-all duration-300 hover:bg-purple-50 hover:scale-[1.01] ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                              <td className="px-3 py-4 text-sm font-semibold text-gray-800 sm:px-6 sm:text-base">{m.teacher?.fullName || 'N/A'}</td>
                              <td className="hidden px-3 py-4 text-sm text-gray-700 sm:px-6 sm:text-base sm:table-cell">{m.teacher?.subject || 'N/A'}</td>
                              <td className="px-3 py-4 text-sm text-gray-700 sm:px-6 sm:text-base">{m.examType}</td>
                              <td className="px-3 py-4 text-center sm:px-6">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
                                  m.marks >= 80 ? 'bg-green-100 text-green-800' :
                                  m.marks >= 60 ? 'bg-blue-100 text-blue-800' :
                                  m.marks >= 45 ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {m.marks}%
                                </span>
                              </td>
                              <td className="hidden px-3 py-4 text-sm text-gray-600 sm:px-6 sm:text-base md:table-cell">{new Date(m.date).toLocaleDateString()}</td>
                              <td className="hidden max-w-xs px-3 py-4 text-sm text-gray-600 truncate sm:px-6 sm:text-base lg:table-cell">{m.specialNote}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Attention Needed Section */}
                  {marks.some(m => m.marks < 20) && (
                    <div className="p-6 mb-8 border-2 border-red-200 shadow-lg bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="text-3xl animate-bounce">🚨</div>
                        <h3 className="text-xl font-bold text-red-700 sm:text-2xl">Subjects Requiring Immediate Attention</h3>
                      </div>
                      <div className="overflow-x-auto shadow-md rounded-xl">
                        <table className="w-full overflow-hidden border border-red-300 rounded-xl">
                          <thead>
                            <tr className="text-white bg-gradient-to-r from-red-600 to-red-700">
                              <th className="px-4 py-3 font-bold text-left">📚 Subject</th>
                              <th className="px-4 py-3 font-bold text-left">📝 Exam Type</th>
                              <th className="px-4 py-3 font-bold text-center">🎯 Marks</th>
                              <th className="px-4 py-3 font-bold text-left">💡 Advice</th>
                            </tr>
                          </thead>
                          <tbody>
                            {marks.filter(m => m.marks < 20).map((m, i) => (
                              <tr key={m._id || i} className="transition-colors bg-red-50 hover:bg-red-100">
                                <td className="px-4 py-3 font-semibold text-red-800">{m.teacher?.subject || 'N/A'}</td>
                                <td className="px-4 py-3 text-red-700">{m.examType}</td>
                                <td className="px-4 py-3 text-center">
                                  <span className="px-3 py-1 text-sm font-bold text-white bg-red-600 rounded-full">
                                    {m.marks}%
                                  </span>
                                </td>
                                <td className="px-4 py-3 font-bold text-red-600">📚 Study well & seek help!</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Enhanced Performance Analysis */}
                  <div className="p-6 border border-indigo-200 shadow-lg sm:p-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl">
                    <h3 className="mb-6 text-2xl font-bold text-center text-transparent sm:text-3xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text">
                      🎯 Performance Analysis Guide
                    </h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                      <div className="p-4 text-center transition-all duration-300 transform shadow-lg sm:p-6 bg-gradient-to-br from-green-200 to-green-300 rounded-2xl hover:scale-105">
                        <div className="mb-3 text-3xl">🌟</div>
                        <span className="text-lg font-bold text-green-800">85+ Marks</span>
                        <div className="mt-2 font-semibold text-green-700">Exceptional!</div>
                      </div>

                      <div className="p-4 text-center transition-all duration-300 transform shadow-lg sm:p-6 bg-gradient-to-br from-blue-200 to-blue-300 rounded-2xl hover:scale-105">
                        <div className="mb-3 text-3xl">👍</div>
                        <span className="text-lg font-bold text-blue-800">65+ Marks</span>
                        <div className="mt-2 font-semibold text-blue-700">Good Work!</div>
                      </div>

                      <div className="p-4 text-center transition-all duration-300 transform shadow-lg sm:p-6 bg-gradient-to-br from-yellow-200 to-yellow-300 rounded-2xl hover:scale-105">
                        <div className="mb-3 text-3xl">📚</div>
                        <span className="text-lg font-bold text-yellow-800">45+ Marks</span>
                        <div className="mt-2 font-semibold text-yellow-700">Study More!</div>
                      </div>

                      <div className="p-4 text-center transition-all duration-300 transform shadow-lg sm:p-6 bg-gradient-to-br from-orange-200 to-orange-300 rounded-2xl hover:scale-105">
                        <div className="mb-3 text-3xl">⚠️</div>
                        <span className="text-lg font-bold text-orange-800">35+ Marks</span>
                        <div className="mt-2 font-semibold text-orange-700">Improvement Needed</div>
                      </div>

                      <div className="p-4 text-center text-white transition-all duration-300 transform shadow-lg sm:p-6 bg-gradient-to-br from-red-400 to-red-500 rounded-2xl hover:scale-105">
                        <div className="mb-3 text-3xl">🚨</div>
                        <span className="text-lg font-bold">Below 35</span>
                        <div className="mt-2 font-semibold">Danger Zone!</div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
       
      <Footer />
    </div>
  );
}