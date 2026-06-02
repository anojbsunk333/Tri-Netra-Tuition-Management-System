import React, { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import { getTeachers } from "../../services/teacherService";

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTeachers() {
      try {
        setLoading(true);
        const data = await getTeachers();
        setTeachers(data);
      } catch (err) {
        setError("Unable to load teachers.");
      } finally {
        setLoading(false);
      }
    }
    loadTeachers();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="rounded-2xl bg-white p-8 shadow-lg border-2 border-primary-200">
            <h1 className="text-3xl font-bold text-primary-900">Teachers</h1>
            <p className="text-gray-600 mt-2">
              Monitor teacher assignments and subject coverage.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-200">
            {loading ? (
              <p className="text-sm text-gray-500">Loading teachers...</p>
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
                        Subject
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                        Batch
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                        Phone
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {teachers.map((teacher) => (
                      <tr key={teacher.id}>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {teacher.id}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {teacher.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {teacher.subject}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {teacher.batch}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {teacher.phone}
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
