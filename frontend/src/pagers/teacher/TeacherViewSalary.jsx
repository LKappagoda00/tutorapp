import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Sidebar from "../../components/Sidebar";

export default function TeacherViewSalary() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [salaryData, setSalaryData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );
  const [viewMode, setViewMode] = useState("summary"); // 'summary' or 'detailed'

  useEffect(() => {
    // Debug: Check what's in localStorage on component mount
    console.log("=== TeacherViewSalary Debug Info ===");
    console.log("localStorage token:", localStorage.getItem("token"));
    console.log("localStorage user:", localStorage.getItem("user"));

    const user = JSON.parse(localStorage.getItem("user") || "null");
    const tokenData = JSON.parse(localStorage.getItem("token") || "null");

    console.log("Parsed user:", user);
    console.log("Parsed token data:", tokenData);
    console.log("====================================");

    fetchTeacherSalary();
  }, [selectedMonth, selectedYear]);

  const fetchTeacherSalary = async () => {
    try {
      setLoading(true);
      setError("");

      const user = JSON.parse(localStorage.getItem("user"));
      console.log("User data from localStorage:", user);

      if (!user || !user.id) {
        setError("User not found. Please login again.");
        navigate("/login");
        return;
      }

      const queryParams = new URLSearchParams();
      if (selectedMonth !== "all") queryParams.append("month", selectedMonth);
      if (selectedYear !== "all") queryParams.append("year", selectedYear);

      console.log("Fetching salary for teacher ID:", user.id);

      // Get token with proper format
      const tokenData = JSON.parse(localStorage.getItem("token"));
      const token = tokenData ? tokenData.value : null;

      if (!token) {
        setError("Session expired. Please login again.");
        navigate("/login");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/payments/teacher/${user.id}/salary?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Teacher salary data:", data);
        setSalaryData(data);
      } else if (response.status === 401) {
        setError("Session expired. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } else if (response.status === 403) {
        setError("Access denied. You can only view your own salary data.");
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("API Error:", errorData);
        setError(
          errorData.error || "Failed to fetch salary data. Please try again."
        );
      }
    } catch (error) {
      console.error("Error fetching teacher salary:", error);
      setError(
        "Failed to load salary data. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const months = [
    { value: "all", label: "All Months" },
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const years = [
    { value: "all", label: "All Years" },
    { value: "2025", label: "2025" },
    { value: "2024", label: "2024" },
    { value: "2023", label: "2023" },
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  const formatMonth = (monthKey) => {
    const [year, month] = monthKey.split("-");
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  const getStatusBadge = (status) => {
    const badges = {
      completed: "bg-green-100 text-green-800 border-green-300",
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      failed: "bg-red-100 text-red-800 border-red-300",
    };
    return badges[status] || badges.pending;
  };

  const exportToCSV = () => {
    if (!salaryData || salaryData.totalPayments === 0) return;

    const csvRows = [];

    if (viewMode === "summary") {
      // Export monthly summary
      csvRows.push([
        "Month",
        "Total Amount",
        "Your Earnings (85%)",
        "Admin Commission (15%)",
        "Completed",
        "Pending",
        "Failed",
        "Total Payments",
      ]);

      salaryData.monthlyData.forEach((monthData) => {
        csvRows.push([
          formatMonth(monthData.month),
          monthData.totalAmount,
          monthData.teacherPayment,
          monthData.adminCommission,
          monthData.completedCount,
          monthData.pendingCount,
          monthData.failedCount,
          monthData.payments.length,
        ]);
      });
    } else {
      // Export detailed payments
      csvRows.push([
        "Date",
        "Student",
        "Subject",
        "Class ID",
        "Course Name",
        "Total Amount",
        "Your Earning",
        "Status",
      ]);

      salaryData.allPayments.forEach((payment) => {
        csvRows.push([
          new Date(payment.createdAt).toLocaleDateString("en-IN"),
          payment.student?.fullName || payment.student?.userName || "N/A",
          payment.subject,
          payment.classId,
          payment.courseName || "",
          payment.amount,
          payment.teacherPayment || 0,
          payment.status.charAt(0).toUpperCase() + payment.status.slice(1),
        ]);
      });
    }

    // Convert to CSV string
    const csvContent = csvRows
      .map((row) =>
        row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `salary_report_${viewMode}_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200">
        <Header />
        <div className="flex flex-1">
          <Sidebar role="teacher" />
          <main className="flex-1 flex items-center justify-center py-10">
            <div className="bg-white/90 rounded-2xl shadow-xl p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading salary data...</p>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200">
      <Header />
      <div className="flex flex-1">
        <Sidebar role="teacher" />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                <div>
                  <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-2">
                    My Salary Dashboard
                  </h2>
                  <p className="text-gray-600">
                    View your monthly earnings and payment details
                  </p>
                </div>

                {/* Filter Controls */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">
                      Month:
                    </label>
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {months.map((month) => (
                        <option key={month.value} value={month.value}>
                          {month.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">
                      Year:
                    </label>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {years.map((year) => (
                        <option key={year.value} value={year.value}>
                          {year.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">
                      View:
                    </label>
                    <select
                      value={viewMode}
                      onChange={(e) => setViewMode(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="summary">Summary</option>
                      <option value="detailed">Detailed</option>
                    </select>
                  </div>

                  {/* Export Button */}
                  {salaryData && salaryData.totalPayments > 0 && (
                    <button
                      onClick={exportToCSV}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors text-sm font-medium flex items-center gap-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Export CSV
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            {salaryData && (
              <>
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">
                          Total Earnings
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {formatCurrency(salaryData.totalEarnings)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">
                          Total Payments
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {salaryData.totalPayments}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">
                          Completed
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {salaryData.statusCounts.completed}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">
                          Pending
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {salaryData.statusCounts.pending}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Monthly Summary View */}
                {viewMode === "summary" &&
                  salaryData.monthlyData.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-4">
                        Monthly Summary
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                              <th className="py-3 px-4 text-left">Month</th>
                              <th className="py-3 px-4 text-right">
                                Total Amount
                              </th>
                              <th className="py-3 px-4 text-right">
                                Your Earnings (85%)
                              </th>
                              <th className="py-3 px-4 text-center">
                                Completed
                              </th>
                              <th className="py-3 px-4 text-center">Pending</th>
                              <th className="py-3 px-4 text-center">
                                Total Payments
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {salaryData.monthlyData.map((monthData, index) => (
                              <tr
                                key={monthData.month}
                                className={`border-b hover:bg-gray-50 ${
                                  index % 2 === 0 ? "bg-gray-25" : ""
                                }`}
                              >
                                <td className="py-3 px-4 font-medium">
                                  {formatMonth(monthData.month)}
                                </td>
                                <td className="py-3 px-4 text-right">
                                  {formatCurrency(monthData.totalAmount)}
                                </td>
                                <td className="py-3 px-4 text-right font-bold text-green-600">
                                  {formatCurrency(monthData.teacherPayment)}
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                                    {monthData.completedCount}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm">
                                    {monthData.pendingCount}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-center">
                                  {monthData.payments.length}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                {/* Detailed Payments View */}
                {viewMode === "detailed" &&
                  salaryData.allPayments.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-4">
                        Payment Details
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                              <th className="py-3 px-4 text-left">Date</th>
                              <th className="py-3 px-4 text-left">Student</th>
                              <th className="py-3 px-4 text-left">Subject</th>
                              <th className="py-3 px-4 text-left">Class ID</th>
                              <th className="py-3 px-4 text-right">
                                Total Amount
                              </th>
                              <th className="py-3 px-4 text-right">
                                Your Earning
                              </th>
                              <th className="py-3 px-4 text-center">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {salaryData.allPayments.map((payment, index) => (
                              <tr
                                key={payment._id}
                                className={`border-b hover:bg-gray-50 ${
                                  index % 2 === 0 ? "bg-gray-25" : ""
                                }`}
                              >
                                <td className="py-3 px-4">
                                  {new Date(
                                    payment.createdAt
                                  ).toLocaleDateString("en-IN")}
                                </td>
                                <td className="py-3 px-4">
                                  {payment.student?.fullName ||
                                    payment.student?.userName ||
                                    "N/A"}
                                </td>
                                <td className="py-3 px-4">{payment.subject}</td>
                                <td className="py-3 px-4">{payment.classId}</td>
                                <td className="py-3 px-4 text-right">
                                  {formatCurrency(payment.amount)}
                                </td>
                                <td className="py-3 px-4 text-right font-bold text-green-600">
                                  {formatCurrency(payment.teacherPayment)}
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(
                                      payment.status
                                    )}`}
                                  >
                                    {payment.status.charAt(0).toUpperCase() +
                                      payment.status.slice(1)}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                {/* No Data Message */}
                {salaryData.totalPayments === 0 && (
                  <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <div className="text-gray-500">
                      <svg
                        className="mx-auto h-16 w-16 text-gray-400 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No salary data found
                      </h3>
                      <p className="text-gray-500">
                        {selectedMonth !== "all" || selectedYear !== "all"
                          ? "No payment records found for the selected time period."
                          : "You have no payment records yet."}
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
