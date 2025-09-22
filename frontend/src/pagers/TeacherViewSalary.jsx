
import Header from '../components/Header';
import Footer from '../components/Footer';
import TeacherStats from '../components/TeacherStats';
export default function TeacherViewSalary() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200">
      <Header />
      <div className="flex flex-col items-center justify-start flex-grow py-8 overflow-y-auto">
          <TeacherStats />
          <br />
        <div className="w-full max-w-2xl p-8 shadow-xl bg-white/90 rounded-2xl">
          <h2 className="mb-6 text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 drop-shadow-lg">My Salary</h2>
          <table className="w-full mt-4 text-center">
            <thead>
              <tr className="text-purple-600">
                <th className="py-2">Month</th>
                <th className="py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-purple-50">
                <td className="py-2">August</td>
                <td className="py-2">Rs. 50,000</td>
              </tr>
              <tr className="hover:bg-purple-50">
                <td className="py-2">July</td>
                <td className="py-2">Rs. 48,000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
}
