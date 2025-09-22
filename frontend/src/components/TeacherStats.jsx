import React from 'react';

export default function TeacherStats() {
  
  const classCount = 5;
  const studentCount = 120;
  const mySubject = 5;

  

  return (
    <div className="flex flex-col w-full gap-8 mt-8">
      <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
        <div className="flex flex-col items-center p-6 text-white shadow-lg bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-2xl">
          <span className="text-3xl font-bold">{classCount}</span>
          <span className="mt-2 font-semibold">My Classes</span>
        </div>
        <div className="flex flex-col items-center p-6 text-white shadow-lg bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-2xl">
          <span className="text-3xl font-bold">{studentCount}</span>
          <span className="mt-2 font-semibold">My Students</span>
         </div>
         <div className="flex flex-col items-center p-6 text-white shadow-lg bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-2xl">
          <span className="text-3xl font-bold">{mySubject}</span>
          <span className="mt-2 font-semibold">My Students</span>
         </div>
      </div>
    </div>
  );
}
