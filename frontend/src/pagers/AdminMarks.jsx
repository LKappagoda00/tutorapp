
import React from 'react';  
import Header from '../components/Header';
import Footer from '../components/Footer';
//import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

export default function AdminMarks() {
  // ...existing code...

  const handleDownloadExcel = () => {
    // Prepare data for Excel
    const data = marks.map(mark => ({
      Student: mark.student?.fullName || mark.student?.userName || mark.student || '-',
      ExamType: mark.examType,
      Lesson: mark.lesson,
      Marks: mark.marks,
      SpecialNote: mark.specialNote || 'No note'
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Marks');
    XLSX.writeFile(workbook, 'marks_report.xlsx');
  };
  const navigate = useNavigate();
  const [marks, setMarks] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    fetchMarks();
  }, []);

  const fetchMarks = () => {
    setLoading(true);
    fetch('http://localhost:5000/api/marks')
      .then(res => res.json())
      .then(data => {
        console.log('Fetched marks data:', data); // Debug: Check the actual data structure
        if (data.length > 0) {
          console.log('First mark object:', data[0]); // Debug: Check field names
        }
        setMarks(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch marks');
        setLoading(false);
      });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this mark?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/marks/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setMarks(marks => marks.filter(m => m._id !== id));
      } else {
        alert('Failed to delete mark');
      }
    } catch {
      alert('Error deleting mark');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200">
      <Header />
      <div className="flex flex-row flex-grow">
        {/* <Sidebar role="admin" /> */}
        <div className="flex flex-col items-center justify-start flex-grow py-8 overflow-y-auto">
          <div className="w-full max-w-2xl p-8 shadow-xl bg-white/90 rounded-2xl">
            <h2 className="mb-6 text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 drop-shadow-lg">Marks Management</h2>
            <div className="flex gap-4 mb-4">
              <button
                className="px-5 py-2 font-bold text-white transition-all shadow bg-gradient-to-r from-green-500 to-blue-500 rounded-xl hover:scale-105"
                onClick={() => navigate('/add-marks')}
              >
                Add Marks
              </button>
              <button
                className="px-5 py-2 font-bold text-white transition-all shadow bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl hover:scale-105"
                onClick={handleDownloadExcel}
              >
                Download Excel
              </button>
            </div>
            {loading ? (
              <div className="text-lg text-center text-gray-500">Loading marks...</div>
            ) : error ? (
              <div className="text-lg text-center text-red-500">{error}</div>
            ) : (
              <table className="w-full mt-4 text-center">
                <thead>
                  <tr className="text-purple-600">
                    <th className="py-2">Student</th>
                    <th className="py-2">Exam Type</th>
                    <th className="py-2">Lesson</th>
                    <th className="py-2">Marks</th>
                    <th className="py-2">Special Note</th>
                    <th className="py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {marks.length === 0 ? (
                    <tr><td colSpan={6} className="py-4 text-gray-500">No marks found.</td></tr>
                  ) : (
                    marks.map(mark => (
                      <tr key={mark._id} className="hover:bg-purple-50">
                        <td className="py-2">{mark.student?.fullName || mark.student?.userName || mark.student || '-'}</td>
                        <td className="py-2">{mark.examType}</td>
                        <td className="py-2">{mark.lesson}</td>
                        <td className="py-2">{mark.marks}</td>
                        <td className="py-2">{mark.specialNote || 'No note'}</td>
                        <td className="flex justify-center gap-2 py-2">
                          <button
                            className="px-3 py-1 font-semibold text-white transition-all rounded-lg shadow bg-gradient-to-r from-blue-500 to-purple-500 hover:scale-105"
                            onClick={() => navigate(`/update-marks/${mark._id}`)}
                          >
                            Update
                          </button>
                          <button
                            className="px-3 py-1 font-semibold text-white transition-all rounded-lg shadow bg-gradient-to-r from-pink-500 to-red-500 hover:scale-105"
                            onClick={() => handleDelete(mark._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
