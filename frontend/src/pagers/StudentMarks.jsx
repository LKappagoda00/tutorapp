import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';

export default function StudentMarks() {
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get student id from localStorage (expects JSON with id property)
    let studentId = '';
    try {
      const userRaw = localStorage.getItem('user');
      if (userRaw) {
        const userObj = JSON.parse(userRaw);
        studentId = userObj.id || userObj._id || '';
      }
    } catch {}
    if (!studentId) {
      setLoading(false);
      return;
    }
    fetch(`http://localhost:5000/api/marks?student=${studentId}`)
      .then(res => res.json())
      .then(data => {
        setMarks(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200">
      <Header />
      <div className="flex-grow flex flex-row">
        <Sidebar role="student" />
        <div className="flex-grow flex flex-col items-center justify-center py-8">
          <div className="bg-white/90 rounded-2xl shadow-xl p-8 w-full max-w-2xl">
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-6 drop-shadow-lg text-center">My Marks</h2>
            {loading ? (
              <div className="text-lg text-gray-600">Loading...</div>
            ) : marks.length === 0 ? (
              <div className="text-lg text-gray-600">No marks found.</div>
            ) : (
              <table className="w-full text-center mt-4">
                <thead>
                  <tr className="text-purple-600">
                    <th className="py-2">Subject</th>
                    <th className="py-2">Exam Type</th>
                    <th className="py-2">Marks</th>
                    <th className="py-2">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {marks.map((m, i) => (
                    <tr key={m._id || i} className="hover:bg-purple-50">
                      <td className="py-2">{m.lesson || m.subject}</td>
                      <td className="py-2">{m.examType}</td>
                      <td className="py-2">{m.marks}</td>
                      <td className="py-2">{m.note}</td>
                    </tr>
                  ))}
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
