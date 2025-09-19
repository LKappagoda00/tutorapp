

import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';

export default function AdminMarks() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200">
      <Header />
      <div className="flex-grow flex flex-row">
        <Sidebar role="admin" />
        <div className="flex-grow flex flex-col items-center justify-start py-8 overflow-y-auto">
          <div className="bg-white/90 rounded-2xl shadow-xl p-8 w-full max-w-2xl">
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-6 drop-shadow-lg">Marks Management</h2>
            <p className="text-lg text-gray-700 mb-4">This is a dummy marks management page for admin. You can view or edit student marks here.</p>
            <button
              className="mb-4 px-5 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold rounded-xl shadow hover:scale-105 transition-all"
              onClick={() => navigate('/add-marks')}
            >
              Add Marks
            </button>
            <table className="w-full text-center mt-4">
              <thead>
                <tr className="text-purple-600">
                  <th className="py-2">Student ID</th>
                  <th className="py-2">Exam Type</th>
                  <th className="py-2">Lesson</th>
                  <th className="py-2">Marks</th>
                  <th className="py-2">Special Note</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-purple-50">
                  <td className="py-2">STU001</td>
                  <td className="py-2">Term Test</td>
                  <td className="py-2">Algebra</td>
                  <td className="py-2">85</td>
                  <td className="py-2">Excellent improvement</td>
                  <td className="py-2 flex gap-2 justify-center">
                    <button
                      className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold shadow hover:scale-105 transition-all"
                      onClick={() => navigate('/update-marks')}
                    >
                      Update
                    </button>
                    <button className="px-3 py-1 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg font-semibold shadow hover:scale-105 transition-all">Delete</button>
                  </td>
                </tr>
                <tr className="hover:bg-purple-50">
                  <td className="py-2">STU002</td>
                  <td className="py-2">Monthly Quiz</td>
                  <td className="py-2">Photosynthesis</td>
                  <td className="py-2">78</td>
                  <td className="py-2">Needs more practice</td>
                  <td className="py-2 flex gap-2 justify-center">
                    <button
                      className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold shadow hover:scale-105 transition-all"
                      onClick={() => navigate('/update-marks')}
                    >
                      Update
                    </button>
                    <button className="px-3 py-1 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg font-semibold shadow hover:scale-105 transition-all">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Footer />
    </div>

  );
  }
