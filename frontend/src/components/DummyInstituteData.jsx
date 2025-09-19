import React from 'react';

export default function DummyInstituteData() {
  // Dummy data
  const stats = {
    totalStudents: 320,
    totalTeachers: 18,
    totalClasses: 24,
    totalSubjects: 12,
    totalIncome: 120000,
    genderRatio: { male: 180, female: 140 },
    classDistribution: [
      { name: 'Grade 10', value: 80 },
      { name: 'Grade 11', value: 90 },
      { name: 'Grade 12', value: 70 },
      { name: 'Grade 13', value: 80 },
    ],
    subjectPopularity: [
      { name: 'Math', value: 90 },
      { name: 'Science', value: 70 },
      { name: 'English', value: 60 },
      { name: 'ICT', value: 50 },
      { name: 'Commerce', value: 50 },
    ],
  };

  // Pie chart for gender ratio
  const genderPie = (
    <svg width="120" height="120" viewBox="0 0 32 32">
      <circle r="16" cx="16" cy="16" fill="#a78bfa" />
      <path d="M16 16 L16 0 A16 16 0 {stats.genderRatio.male / (stats.genderRatio.male + stats.genderRatio.female) > 0.5 ? 1 : 0} 1 {16 + 16 * Math.sin(2 * Math.PI * stats.genderRatio.male / (stats.genderRatio.male + stats.genderRatio.female))} {16 - 16 * Math.cos(2 * Math.PI * stats.genderRatio.male / (stats.genderRatio.male + stats.genderRatio.female))} Z" fill="#60a5fa" />
    </svg>
  );

  return (
    <div className="w-full flex flex-col gap-8 mt-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-white rounded-2xl shadow-lg p-6 flex flex-col items-center">
          <span className="text-3xl font-bold">{stats.totalStudents}</span>
          <span className="mt-2 font-semibold">Total Students</span>
        </div>
        <div className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-white rounded-2xl shadow-lg p-6 flex flex-col items-center">
          <span className="text-3xl font-bold">{stats.totalTeachers}</span>
          <span className="mt-2 font-semibold">Total Teachers</span>
        </div>
        <div className="bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 text-white rounded-2xl shadow-lg p-6 flex flex-col items-center">
          <span className="text-3xl font-bold">{stats.totalClasses}</span>
          <span className="mt-2 font-semibold">Total Classes</span>
        </div>
        <div className="bg-gradient-to-r from-blue-400 via-pink-400 to-purple-400 text-white rounded-2xl shadow-lg p-6 flex flex-col items-center">
          <span className="text-3xl font-bold">{stats.totalSubjects}</span>
          <span className="mt-2 font-semibold">Total Subjects</span>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-8 w-full">
        <div className="flex-1 bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center">
          <h2 className="text-xl font-bold mb-4 text-purple-700">Gender Ratio</h2>
          {genderPie}
          <div className="flex justify-between w-full mt-4">
            <span className="text-blue-500 font-semibold">Male: {stats.genderRatio.male}</span>
            <span className="text-pink-500 font-semibold">Female: {stats.genderRatio.female}</span>
          </div>
        </div>
        <div className="flex-1 bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-purple-700">Class Distribution</h2>
          <table className="w-full text-center">
            <thead>
              <tr className="text-purple-600">
                <th className="py-2">Class</th>
                <th className="py-2">Students</th>
              </tr>
            </thead>
            <tbody>
              {stats.classDistribution.map((c) => (
                <tr key={c.name} className="hover:bg-purple-50">
                  <td className="py-2 font-semibold">{c.name}</td>
                  <td className="py-2">{c.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex-1 bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-purple-700">Subject Popularity</h2>
          <div className="flex flex-col gap-2">
            {stats.subjectPopularity.map((s) => (
              <div key={s.name} className="flex items-center gap-2">
                <div className="w-32 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded h-4" style={{ width: `${s.value * 1.5}px` }}></div>
                <span className="font-semibold text-gray-700 w-20">{s.name}</span>
                <span className="text-blue-600 font-bold">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-white rounded-2xl shadow-lg p-6 flex flex-col items-center">
        <span className="text-2xl font-bold">Total Income</span>
        <span className="text-4xl font-extrabold mt-2">${stats.totalIncome.toLocaleString()}</span>
      </div>
    </div>
  );
}
