import React, { useEffect, useState } from "react";
import StudentSidebar from "../../components/layout/StudentSidebar";
import { getMyStudentOverview } from "../../services/studentPortalService";

function formatExamDate(value) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export default function Results() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyStudentOverview()
      .then(({ exams: results }) => setExams(results || []))
      .catch(() => setError("Unable to load your results. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  const average = exams.length
    ? Math.round(
        exams.reduce(
          (sum, item) =>
            sum +
            (Number(item.marks) / Math.max(Number(item.total) || 100, 1)) * 100,
          0,
        ) / exams.length,
      )
    : 0;
  const gpa = exams.length
    ? (
        exams.reduce((sum, item) => sum + Number(item.gpa || 0), 0) /
        exams.length
      ).toFixed(2)
    : "—";

  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudentSidebar />
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="mb-2 text-4xl font-bold text-gray-900">
              My Results
            </h1>
            <p className="text-gray-600">Your published examination results.</p>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              ["Published results", exams.length],
              ["Average marks", `${average}%`],
              ["Average GPA", gpa],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-xl border border-gray-100 bg-white p-6 shadow-md"
              >
                <p className="text-sm text-gray-600">{label}</p>
                <p className="mt-2 text-3xl font-bold text-primary-900">
                  {value}
                </p>
              </div>
            ))}
          </div>

          <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md">
            <div className="border-b p-6">
              <h2 className="text-2xl font-bold">Exam Results</h2>
            </div>

            {loading ? (
              <p className="p-6 text-center">Loading results...</p>
            ) : error ? (
              <p className="p-6 text-center text-red-600">{error}</p>
            ) : exams.length ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      {[
                        "Exam",
                        "Subject",
                        "Date",
                        "Marks",
                        "Grade",
                        "Status",
                      ].map((heading) => (
                        <th
                          key={heading}
                          className="px-6 py-3 text-left text-sm font-semibold text-gray-700"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {exams.map((exam) => {
                      const marks = Number(exam.marks);
                      const total = Number(exam.total);
                      const passed =
                        Number.isFinite(marks) &&
                        Number.isFinite(total) &&
                        total > 0 &&
                        marks >= total * 0.4;

                      return (
                        <tr key={exam.id}>
                          <td className="px-6 py-4">
                            {exam.examName || "Exam"}
                          </td>
                          <td className="px-6 py-4 font-medium">
                            {exam.subject}
                          </td>
                          <td className="px-6 py-4">
                            {formatExamDate(exam.date)}
                          </td>
                          <td className="px-6 py-4">
                            {exam.marks} / {exam.total}
                          </td>
                          <td className="px-6 py-4">{exam.grade || "—"}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${
                                passed
                                  ? "border-green-200 bg-green-100 text-green-700"
                                  : "border-red-200 bg-red-100 text-red-700"
                              }`}
                            >
                              {passed ? "PASS" : "FAIL"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="p-8 text-center text-gray-500">
                No results have been published for your account.
              </p>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
