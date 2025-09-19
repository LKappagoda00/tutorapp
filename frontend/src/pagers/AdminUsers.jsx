
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';

export default function AdminUsers() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200">
      <Header />
      <div className="flex-grow flex flex-row">
        <Sidebar role="admin" />
        <div className="flex-grow flex flex-col items-center justify-start py-8 overflow-y-auto">
          <div className="bg-white/90 rounded-2xl shadow-xl p-8 w-full max-w-2xl">
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-6 drop-shadow-lg">User Management</h2>
            <p className="text-lg text-gray-700 mb-4">This is a dummy user management page for admin. You can view, add, or remove users here.</p>
            <table className="w-full text-center mt-4">
              <thead>
                <tr className="text-purple-600">
                  <th className="py-2">Name</th>
                  <th className="py-2">Role</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-purple-50">
                  <td className="py-2">Nimal Fernando</td>
                  <td className="py-2">Student</td>
                  <td className="py-2 text-green-600">Active</td>
                </tr>
                <tr className="hover:bg-purple-50">
                  <td className="py-2">Sunil Silva</td>
                  <td className="py-2">Teacher</td>
                  <td className="py-2 text-red-600">Inactive</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
