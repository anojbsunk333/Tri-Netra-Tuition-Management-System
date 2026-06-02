import React, { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import { getStudents } from "../../services/studentService";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStudents() {
      try {
        setLoading(true);
        const data = await getStudents();
        setStudents(data);
      } catch (err) {
        setError("Unable to load students.");
      } finally {
        setLoading(false);
      }
    }
    loadStudents();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="rounded-2xl bg-white p-8 shadow-lg border-2 border-primary-200">
            <h1 className="text-3xl font-bold text-primary-900">Students</h1>
            <p className="text-gray-600 mt-2">
              Manage all student records and fee status.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-200">
            {loading ? (
              <p className="text-sm text-gray-500">Loading students...</p>
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
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                        Class
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                        Batch
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                        Phone
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                        Fee
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {students.map((student) => (
                      <tr key={student.id}>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {student.id}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {student.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {student.class}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {student.batch}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {student.phone}
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold capitalize text-gray-900">
                          {student.feeStatus || "N/A"}
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
