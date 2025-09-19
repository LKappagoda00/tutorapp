import React from 'react';

export default function TeacherStats() {
  // Dummy data
  const salaryHistory = [
    { month: 'August', amount: 50000 },
    { month: 'July', amount: 48000 },
    { month: 'June', amount: 47000 },
    { month: 'May', amount: 46000 },
  ];
  const classCount = 5;
  const studentCount = 120;
  const subjectList = [
    { name: 'Math', students: 40 },
    { name: 'Science', students: 30 },
    { name: 'ICT', students: 25 },
    { name: 'English', students: 25 },
  ];

  // Simple bar chart for salary history
  const maxSalary = Math.max(...salaryHistory.map(s => s.amount));

  return (
    <div className="w-full flex flex-col gap-8 mt-8">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-white rounded-2xl shadow-lg p-6 flex flex-col items-center">
          <span className="text-3xl font-bold">{classCount}</span>
          <span className="mt-2 font-semibold">My Classes</span>
        </div>
        <div className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-white rounded-2xl shadow-lg p-6 flex flex-col items-center">
          <span className="text-3xl font-bold">{studentCount}</span>
          <span className="mt-2 font-semibold">My Students</span>
        </div>
        <div className="bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 text-white rounded-2xl shadow-lg p-6 flex flex-col items-center">
          <span className="text-3xl font-bold">{subjectList.length}</span>
          <span className="mt-2 font-semibold">Subjects</span>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-8 w-full">
        <div className="flex-1 bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center">
          <h2 className="text-xl font-bold mb-4 text-purple-700">Salary History</h2>
          <div className="w-full flex flex-col gap-2">
            {salaryHistory.map((s) => (
              <div key={s.month} className="flex items-center gap-2">
                <div className="h-4 rounded bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400" style={{ width: `${(s.amount / maxSalary) * 200}px` }}></div>
                <span className="font-semibold text-gray-700 w-20">{s.month}</span>
                <span className="text-blue-600 font-bold">Rs. {s.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-purple-700">Subjects & Students</h2>
          <table className="w-full text-center">
            <thead>
              <tr className="text-purple-600">
                <th className="py-2">Subject</th>
                <th className="py-2">Students</th>
              </tr>
            </thead>
            <tbody>
              {subjectList.map((s) => (
                <tr key={s.name} className="hover:bg-purple-50">
                  <td className="py-2 font-semibold">{s.name}</td>
                  <td className="py-2">{s.students}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
