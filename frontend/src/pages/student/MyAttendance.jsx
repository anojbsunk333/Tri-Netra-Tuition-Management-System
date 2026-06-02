import React, { useEffect, useState } from "react";
import { getAttendanceRecords } from "../../services/attendanceService";

export default function MyAttendance() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    getAttendanceRecords().then(setRecords).catch(console.error);
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">My Attendance</h1>
      <p className="text-sm text-gray-600">
        View your attendance records by date.
      </p>
      <div className="overflow-x-auto border rounded-lg bg-white shadow-sm">
        <table className="min-w-full text-left divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                Date
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                Batch
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {records.map((record) => (
              <tr key={record.id}>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {record.date}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {record.batch}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {record.status}
                </td>
              </tr>
            ))}
            {records.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-6 text-center text-sm text-gray-500"
                >
                  No attendance records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
