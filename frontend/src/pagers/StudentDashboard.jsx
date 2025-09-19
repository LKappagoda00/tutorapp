
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';

export default function StudentDashboard() {
  // Dummy data
  const marks = [
    { subject: 'Math', mark: 85 },
    { subject: 'Science', mark: 78 },
    { subject: 'English', mark: 92 },
    { subject: 'History', mark: 74 },
    { subject: 'ICT', mark: 88 },
  ];
  const attendance = [
    { type: 'Present', value: 40, color: '#22c55e' },
    { type: 'Absent', value: 3, color: '#ef4444' },
    { type: 'Late', value: 2, color: '#fbbf24' },
  ];
  const totalAttendance = attendance.reduce((sum, a) => sum + a.value, 0);
  let attendanceOffset = 0;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200">
      <Header />
      <div className="flex-grow flex flex-row">
        <Sidebar role="student" />
        <div className="flex-grow flex flex-col items-center justify-center gap-8 py-10">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-10 flex flex-col items-center animate-fade-in w-full max-w-4xl">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-6 drop-shadow-lg">Student Dashboard</h1>
            <p className="text-lg text-gray-700 mb-8">Welcome, Student! Here is your academic summary.</p>
            {/* Marks Table */}
            <div className="w-full mb-8">
              <h2 className="text-xl font-bold mb-2 text-blue-600">Marks Table</h2>
              <table className="w-full text-center border rounded-xl overflow-hidden">
                <thead className="bg-blue-100">
                  <tr>
                    <th className="py-2 px-4">Subject</th>
                    <th className="py-2 px-4">Mark</th>
                  </tr>
                </thead>
                <tbody>
                  {marks.map((m) => (
                    <tr key={m.subject} className="hover:bg-blue-50">
                      <td className="py-2 px-4 font-semibold">{m.subject}</td>
                      <td className="py-2 px-4">{m.mark}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Simple Bar Graph */}
            <div className="w-full flex flex-col md:flex-row gap-8 justify-center items-center mb-8">
              <div className="flex-1 flex flex-col items-center">
                <h2 className="text-xl font-bold mb-2 text-purple-600">Marks Bar Graph</h2>
                <svg width="260" height="120" viewBox="0 0 260 120">
                  {marks.map((m, i) => (
                    <g key={m.subject}>
                      <rect
                        x={20 + i * 45}
                        y={110 - m.mark}
                        width="30"
                        height={m.mark}
                        fill="#a78bfa"
                        rx="6"
                      />
                      <text x={35 + i * 45} y="115" fontSize="12" textAnchor="middle">{m.subject}</text>
                      <text x={35 + i * 45} y={110 - m.mark - 5} fontSize="12" textAnchor="middle">{m.mark}</text>
                    </g>
                  ))}
                </svg>
              </div>
              {/* Pie Chart */}
              <div className="flex-1 flex flex-col items-center">
                <h2 className="text-xl font-bold mb-2 text-green-600">Attendance Pie Chart</h2>
                <svg width="120" height="120" viewBox="0 0 120 120">
                  {attendance.map((a, i) => {
                    const radius = 50;
                    const circumference = 2 * Math.PI * radius;
                    const value = a.value / totalAttendance;
                    const dasharray = `${value * circumference} ${circumference}`;
                    const dashoffset = attendanceOffset * circumference;
                    const el = (
                      <circle
                        key={a.type}
                        r={radius}
                        cx="60"
                        cy="60"
                        fill="transparent"
                        stroke={a.color}
                        strokeWidth="20"
                        strokeDasharray={dasharray}
                        strokeDashoffset={-dashoffset}
                        style={{ transition: 'stroke-dashoffset 0.5s' }}
                      />
                    );
                    attendanceOffset += value;
                    return el;
                  })}
                  {/* Center label */}
                  <circle r="35" cx="60" cy="60" fill="#fff" />
                  <text x="60" y="65" fontSize="16" textAnchor="middle" fill="#333">{totalAttendance}</text>
                </svg>
                <div className="flex gap-4 mt-2">
                  {attendance.map(a => (
                    <div key={a.type} className="flex items-center gap-1 text-sm">
                      <span style={{ background: a.color }} className="inline-block w-3 h-3 rounded-full"></span>
                      {a.type} ({a.value})
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
