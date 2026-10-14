import React, { useEffect, useState } from "react";
import TeacherSidebar from "../../components/layout/TeacherSidebar";
import { getStudents } from "../../services/studentService";

export default function TeacherStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStudents() {
      try {
        setLoading(true);
        setError("");
        const data = await getStudents();
        setStudents(Array.isArray(data) ? data : []);
      } catch (requestError) {
        setError(
          requestError?.response?.data?.message ||
            requestError?.message ||
            "Unable to load students.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadStudents();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <TeacherSidebar />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Students</h1>
            <p className="text-gray-600 mt-2">Student directory</p>
          </div>

          {loading ? (
            <div className="rounded-xl bg-white p-6 shadow border border-gray-100 text-gray-600">
              Loading students...
            </div>
          ) : error ? (
            <div className="rounded-xl bg-red-50 p-6 border border-red-200 text-red-700">
              {error}
            </div>
          ) : students.length === 0 ? (
            <div className="rounded-xl bg-white p-6 shadow border border-gray-100 text-gray-600">
              No students found.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl bg-white shadow border border-gray-100">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                      Student ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                      Class
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                      Batch
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                      Phone
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {students.map((student) => (
                    <tr key={student.id || student.email || student.name}>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                        {student.id || "—"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                        {student.name || "—"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                        {student.class || "—"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                        {student.batch || "—"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                        {student.phone || "—"}
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
