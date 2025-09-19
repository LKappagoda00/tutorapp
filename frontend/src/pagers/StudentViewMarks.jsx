
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function StudentViewMarks() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200">
      <Header />
      <div className="flex-grow flex flex-col items-center justify-start py-8 overflow-y-auto">
        <div className="bg-white/90 rounded-2xl shadow-xl p-8 w-full max-w-2xl">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-6 drop-shadow-lg">My Marks</h2>
          <p className="text-lg text-gray-700 mb-4">This is a dummy marks view page for students. You can see your marks here.</p>
          <table className="w-full text-center mt-4">
            <thead>
              <tr className="text-purple-600">
                <th className="py-2">Subject</th>
                <th className="py-2">Marks</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-purple-50">
                <td className="py-2">Math</td>
                <td className="py-2">85</td>
              </tr>
              <tr className="hover:bg-purple-50">
                <td className="py-2">Science</td>
                <td className="py-2">78</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
}
