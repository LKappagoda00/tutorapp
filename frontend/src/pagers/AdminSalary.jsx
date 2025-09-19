

import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import SalaryTable from '../components/SalaryTable';

export default function AdminSalary() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200">
      <Header />
      <div className="flex-grow flex flex-row">
        <Sidebar role="admin" />
        <div className="flex-grow flex flex-col items-center justify-start py-8 overflow-y-auto">
          <div className="bg-white/90 rounded-2xl shadow-xl p-8 w-full max-w-4xl">
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-6 drop-shadow-lg">Salary Management</h2>
            <SalaryTable />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
