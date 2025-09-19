import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const dummySalaries = [
  {
    tutorName: 'Mr. Silva',
    classes: [
      { id: 'CL001', date: '01/08/2025', amount: 25000 },
      { id: 'CL002', date: '10/08/2025', amount: 25000 },
    ],
    serviceCharge: 2000,
    bank: {
      name: 'Bank of Ceylon',
      branch: 'Colombo',
      accNo: '1234567890',
      accName: 'Mr. Silva',
    },
  },
  {
    tutorName: 'Ms. Perera',
    classes: [
      { id: 'CL003', date: '05/08/2025', amount: 24000 },
      { id: 'CL004', date: '15/08/2025', amount: 24000 },
    ],
    serviceCharge: 1800,
    bank: {
      name: 'People’s Bank',
      branch: 'Kandy',
      accNo: '9876543210',
      accName: 'Ms. Perera',
    },
  },
];


export default function SalaryTable() {
  const [showBank, setShowBank] = useState(null);
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          className="px-6 py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-extrabold rounded-xl shadow-lg hover:scale-105 transition-all text-lg tracking-wide"
          onClick={() => navigate('/create-salary')}
        >
          + Create Salary
        </button>
      </div>
      <table className="w-full text-center mt-2 border-separate border-spacing-y-2">
        <thead>
          <tr className="text-purple-600 bg-purple-50">
            <th className="py-2">No</th>
            <th className="py-2">Tutor Details</th>
            <th className="py-2">Bank Details</th>
            <th className="py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {dummySalaries.map((tutor, idx) => {
            const total = tutor.classes.reduce((sum, c) => sum + c.amount, 0);
            const net = total - tutor.serviceCharge;
            return (
              <tr key={tutor.tutorName} className="bg-white shadow rounded-xl">
                <td className="py-4 align-top font-bold text-lg">{idx + 1}</td>
                <td className="py-4 align-top">
                  <div className="font-semibold text-blue-700 mb-2">{tutor.tutorName}</div>
                  <table className="w-full text-xs border mt-2 mb-2">
                    <thead>
                      <tr className="bg-blue-50">
                        <th className="py-1">Class ID</th>
                        <th className="py-1">Date</th>
                        <th className="py-1">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tutor.classes.map((c, i) => (
                        <tr key={c.id}>
                          <td className="py-1">{c.id}</td>
                          <td className="py-1">{c.date}</td>
                          <td className="py-1">{c.amount.toLocaleString()}</td>
                        </tr>
                      ))}
                      <tr className="font-bold bg-purple-50">
                        <td colSpan={2}>Total</td>
                        <td>{total.toLocaleString()}</td>
                      </tr>
                      <tr className="bg-pink-50">
                        <td colSpan={2}>Service Charge</td>
                        <td>-{tutor.serviceCharge.toLocaleString()}</td>
                      </tr>
                      <tr className="font-bold bg-green-50">
                        <td colSpan={2}>Net Amount</td>
                        <td>{net.toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                <td className="py-4 align-top">
                  <button
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-lg font-bold shadow hover:scale-105 transition"
                    onClick={() => setShowBank(idx === showBank ? null : idx)}
                  >
                    View
                  </button>
                  {showBank === idx && (
                    <div className="mt-2 p-3 bg-white border rounded-xl shadow text-left text-xs">
                      <div><span className="font-semibold">Bank:</span> {tutor.bank.name}</div>
                      <div><span className="font-semibold">Branch:</span> {tutor.bank.branch}</div>
                      <div><span className="font-semibold">Acc No:</span> {tutor.bank.accNo}</div>
                      <div><span className="font-semibold">Acc Name:</span> {tutor.bank.accName}</div>
                    </div>
                  )}
                </td>
                <td className="py-4 align-top flex flex-col gap-2 items-center">
                  <button className="px-4 py-2 bg-green-500 text-white rounded-lg font-bold shadow hover:bg-green-600 transition">Confirm</button>
                  <button
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-bold shadow hover:bg-yellow-600 transition"
                    onClick={() => navigate('/update-salary')}
                  >
                    Update
                  </button>
                  <button className="px-4 py-2 bg-red-500 text-white rounded-lg font-bold shadow hover:bg-red-600 transition">Reject</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
