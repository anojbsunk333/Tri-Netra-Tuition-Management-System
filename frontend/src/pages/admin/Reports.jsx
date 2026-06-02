import React, { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import { getStudents } from "../../services/studentService";
import { getTeachers } from "../../services/teacherService";
import { getFees } from "../../services/feeService";
import { getExams } from "../../services/examService";

export default function Reports() {
  const [summary, setSummary] = useState({
    students: 0,
    teachers: 0,
    fees: 0,
    exams: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSummary() {
      try {
        setLoading(true);
        const [students, teachers, fees, exams] = await Promise.all([
          getStudents(),
          getTeachers(),
          getFees(),
          getExams(),
        ]);
        setSummary({
          students: students.length,
          teachers: teachers.length,
          fees: fees.length,
          exams: exams.length,
        });
      } catch (err) {
        setError("Unable to load report summary.");
      } finally {
        setLoading(false);
      }
    }
    loadSummary();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="rounded-2xl bg-white p-8 shadow-lg border-2 border-primary-200">
            <h1 className="text-3xl font-bold text-primary-900">Reports</h1>
            <p className="text-gray-600 mt-2">
              View summary reports and generate printable summaries.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-200">
            {loading ? (
              <p className="text-sm text-gray-500">Loading reports...</p>
            ) : error ? (
              <p className="text-sm text-red-600">{error}</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="rounded-xl bg-blue-50 border border-blue-200 p-6">
                  <p className="text-sm text-gray-600">Students</p>
                  <p className="text-3xl font-bold text-blue-900 mt-2">
                    {summary.students}
                  </p>
                </div>
                <div className="rounded-xl bg-green-50 border border-green-200 p-6">
                  <p className="text-sm text-gray-600">Teachers</p>
                  <p className="text-3xl font-bold text-green-900 mt-2">
                    {summary.teachers}
                  </p>
                </div>
                <div className="rounded-xl bg-orange-50 border border-orange-200 p-6">
                  <p className="text-sm text-gray-600">Fee Records</p>
                  <p className="text-3xl font-bold text-orange-900 mt-2">
                    {summary.fees}
                  </p>
                </div>
                <div className="rounded-xl bg-purple-50 border border-purple-200 p-6">
                  <p className="text-sm text-gray-600">Exam Records</p>
                  <p className="text-3xl font-bold text-purple-900 mt-2">
                    {summary.exams}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
