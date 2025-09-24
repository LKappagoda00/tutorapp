import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Sidebar from "../../components/Sidebar";
import SalaryTable from "../../components/SalaryTable";

export default function AdminSalary() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200">
      <Header />
      <div className="flex-grow flex flex-row">
        <Sidebar role="admin" />
        <div className="flex-grow p-6">
          {" "}
          <SalaryTable />
        </div>
      </div>
      <Footer />
    </div>
  );
}
