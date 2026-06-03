import React, { useEffect, useState } from "react";
import StudentSidebar from "../../components/layout/StudentSidebar";
import { getExams } from "../../services/examService";
import Badge from "../../components/Badge";

export default function Results() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getExams()
      .then(setExams)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Calculate statistics
  const totalExams = exams.length || 0;
  const averageMarks =
    exams.length > 0
      ? Math.round(
          exams.reduce((sum, e) => sum + (e.marks || e.marksObtained || 0), 0) /
            exams.length,
        )
      : 0;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudentSidebar />
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              My Results
            </h1>
            <p className="text-gray-600">
              View your exam results and academic performance.
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="rounded-xl bg-white p-6 shadow-md border border-gray-100">
              <p className="text-gray-600 text-sm">Total Exams</p>
              <p className="text-3xl font-bold text-primary-900 mt-2">
                {totalExams}
              </p>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-md border border-blue-200">
              <p className="text-gray-600 text-sm">Average Marks</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">
                {averageMarks}%
              </p>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 p-6 shadow-md border border-purple-200">
              <p className="text-gray-600 text-sm">Current Status</p>
              <p className="text-3xl font-bold text-purple-900 mt-2">
                ✅ Active
              </p>
            </div>
          </div>

          {/* Results Table */}
          <div className="rounded-xl bg-white shadow-md border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Exam Results</h2>
            </div>
            {loading ? (
              <div className="p-6 text-center text-gray-600">
                Loading results...
              </div>
            ) : exams.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Subject
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Exam Date
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Marks
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Grade
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {exams.map((exam, index) => (
                      <tr key={exam._id || index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {exam.subject || "Subject"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {typeof exam.date === "string"
                            ? new Date(exam.date).toLocaleDateString()
                            : exam.date || "-"}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                          {exam.marks || exam.marksObtained || 0} / 100
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-semibold">
                            {exam.grade || "A"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <Badge
                            status={
                              (exam.marks || exam.marksObtained || 0) >= 40
                                ? "paid"
                                : "due"
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                <p className="mb-2">No exam results found yet.</p>
                <p className="text-sm">
                  Your results will appear here once exams are graded.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
