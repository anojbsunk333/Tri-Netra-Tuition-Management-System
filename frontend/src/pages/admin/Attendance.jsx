import React, { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import { getAttendanceReport } from "../../services/attendanceService";

export default function AttendanceAdmin() {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [month, setMonth] = useState("");
  const [batch, setBatch] = useState("all");

  async function loadReport() {
    try {
      setLoading(true);
      setError("");

      const data = await getAttendanceReport({
        month: month || undefined,
        batch,
      });

      setReport(data.report || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load attendance report.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReport();
  }, []);

  function handleFilter() {
    loadReport();
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>

          <p className="mt-1 text-gray-600">
            View and analyze attendance records for all students.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Month */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Month
              </label>

              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-primary-500"
              />
            </div>

            {/* Batch */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Batch
              </label>

              <select
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-primary-500"
              >
                <option value="all">All Batches</option>
                <option value="Morning">Morning</option>
                <option value="Day">Day</option>
                <option value="Evening">Evening</option>
              </select>
            </div>

            {/* Button */}
            <div className="flex items-end">
              <button
                onClick={handleFilter}
                className="w-full rounded-lg bg-primary-600 px-4 py-3 font-semibold text-white transition hover:bg-primary-700"
              >
                Apply Filter
              </button>
            </div>
          </div>
        </div>

        {/* Report */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Attendance Report
            </h2>

            <span className="text-sm text-gray-500">
              {report.length} student(s)
            </span>
          </div>

          {loading ? (
            <p className="text-sm text-gray-500">
              Loading attendance report...
            </p>
          ) : error ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : report.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-gray-500">No attendance records found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Student ID
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Student
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Batch
                    </th>

                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Total
                    </th>

                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Present
                    </th>

                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Absent
                    </th>

                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Percentage
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 bg-white">
                  {report.map((student) => (
                    <tr key={student.studentId}>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {student.studentId}
                      </td>

                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {student.name || "N/A"}
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-700">
                        {student.batch || "N/A"}
                      </td>

                      <td className="px-4 py-3 text-center text-sm text-gray-700">
                        {student.total}
                      </td>

                      <td className="px-4 py-3 text-center text-sm font-semibold text-green-600">
                        {student.present}
                      </td>

                      <td className="px-4 py-3 text-center text-sm font-semibold text-red-600">
                        {student.absent}
                      </td>

                      <td className="px-4 py-3 text-center">
                        <span
                          className={`rounded-full px-3 py-1 text-sm font-semibold ${
                            student.percentage >= 75
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {student.percentage}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
