
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function TeacherViewSalary() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200">
      <Header />
      <div className="flex-grow flex flex-col items-center justify-start py-8 overflow-y-auto">
        <div className="bg-white/90 rounded-2xl shadow-xl p-8 w-full max-w-2xl">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-6 drop-shadow-lg">My Salary</h2>
          <table className="w-full text-center mt-4">
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
