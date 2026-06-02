import React, { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import { getAttendanceRecords } from "../../services/attendanceService";

export default function AttendanceAdmin() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAttendance() {
      try {
        setLoading(true);
        const data = await getAttendanceRecords();
        setRecords(data);
      } catch (err) {
        setError("Unable to load attendance records.");
      } finally {
        setLoading(false);
      }
    }

    loadAttendance();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="rounded-2xl bg-white p-8 shadow-lg border-2 border-primary-200">
            <h1 className="text-3xl font-bold text-primary-900">Attendance</h1>
            <p className="text-gray-600 mt-2">
              View attendance records for all students.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-200">
            {loading ? (
              <p className="text-sm text-gray-500">
                Loading attendance records...
              </p>
            ) : error ? (
              <p className="text-sm text-red-600">{error}</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                        ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                        Student
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                        Batch
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {records.map((record) => (
                      <tr key={record.id}>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {record.id}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {record.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {record.batch}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {record.date}
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold capitalize text-gray-900">
                          {record.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
