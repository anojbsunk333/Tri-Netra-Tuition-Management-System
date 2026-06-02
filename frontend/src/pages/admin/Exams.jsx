import React, { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import { getExams } from "../../services/examService";

export default function Exams() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadExams() {
      try {
        setLoading(true);
        const data = await getExams();
        setExams(data);
      } catch (err) {
        setError("Unable to load exam records.");
      } finally {
        setLoading(false);
      }
    }
    loadExams();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="rounded-2xl bg-white p-8 shadow-lg border-2 border-primary-200">
            <h1 className="text-3xl font-bold text-primary-900">Exams</h1>
            <p className="text-gray-600 mt-2">
              Review exam performance and results.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-200">
            {loading ? (
              <p className="text-sm text-gray-500">Loading exam data...</p>
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
                        Subject
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                        Marks
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                        Grade
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {exams.map((exam) => (
                      <tr key={exam.id}>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {exam.id}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {exam.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {exam.subject}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {exam.marks}/{exam.total}
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold uppercase text-gray-900">
                          {exam.grade}
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
