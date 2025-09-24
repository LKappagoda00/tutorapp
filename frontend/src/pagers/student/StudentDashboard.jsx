
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Sidebar from '../../components/Sidebar';
import StudentProfile from './studentprofile';

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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200">
      <Header />
      <div className="flex flex-row flex-grow">
        <Sidebar role="student" />
        <div className="flex flex-col items-center justify-center flex-grow gap-8 py-10">
          
          <div className="w-full max-w-6xl p-6 bg-white rounded-lg shadow-md bg-opacity-70">
             <StudentProfile/>
            </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
