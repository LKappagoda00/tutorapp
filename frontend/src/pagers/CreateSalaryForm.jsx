
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';

export default function CreateSalaryForm() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200">
      <Header />
      <div className="flex-grow flex flex-row">
        <Sidebar role="admin" />
        <div className="flex-grow flex flex-col items-center justify-start py-10">
          <div className="bg-white/90 rounded-2xl shadow-xl p-8 w-full max-w-2xl">
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-6 drop-shadow-lg text-center">Create Salary</h2>
            <form className="flex flex-col gap-6">
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Tutor Name</label>
                <input className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow" placeholder="Enter tutor name" />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Class ID</label>
                <input className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow" placeholder="e.g. CL001" />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Date</label>
                <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow" />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Amount</label>
                <input type="number" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow" placeholder="Enter amount" />
              </div>
              <button type="submit" className="w-full py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-extrabold rounded-xl shadow-lg hover:scale-105 transition-all text-lg tracking-wide">Submit</button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
