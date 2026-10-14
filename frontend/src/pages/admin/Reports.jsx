import React, { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import { getStudents } from "../../services/studentService";
import { getTeachers } from "../../services/teacherService";
import { getBatches } from "../../services/batchService";
import { getExams } from "../../services/examService";
import {
  getAttendanceReport,
  getFeeReport,
} from "../../services/reportService";

export default function Reports() {
  const [summary, setSummary] = useState({
    students: 0,
    teachers: 0,
    fees: {
      totalAmount: 0,
      totalPaid: 0,
      totalDue: 0,
      statusCounts: {},
    },
    attendance: {
      totalRecords: 0,
      present: 0,
      absent: 0,
      percentage: 0,
    },
    exams: {
      total: 0,
      averageMarks: 0,
      averageGpa: 0,
      gradeCounts: {},
    },
  });

  const [loading, setLoading] = useState(true);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [error, setError] = useState("");
  const [batches, setBatches] = useState([]);
  const [attendanceMonth, setAttendanceMonth] = useState("");
  const [attendanceBatch, setAttendanceBatch] = useState("");

  function updateAttendanceSummary(attendanceReport) {
    setSummary((current) => ({
      ...current,
      attendance: {
        totalRecords: Number(attendanceReport?.totalRecords || 0),
        present: Number(attendanceReport?.present || 0),
        absent: Number(attendanceReport?.absent || 0),
        percentage: Number(attendanceReport?.percentage || 0),
      },
    }));
  }

  useEffect(() => {
    async function loadSummary() {
      try {
        setLoading(true);
        setError("");

        const [
          students,
          teachers,
          feeReport,
          attendanceReport,
          exams,
          batchData,
        ] = await Promise.all([
          getStudents(),
          getTeachers(),
          getFeeReport(),
          getAttendanceReport(),
          getExams(),
          getBatches(),
        ]);

        const batchRecords = Array.isArray(batchData) ? batchData : [];
        const fallbackBatches = Array.isArray(attendanceReport?.report)
          ? attendanceReport.report
              .map((record) => record.batch)
              .filter(Boolean)
              .filter((value, index, values) => values.indexOf(value) === index)
              .map((name) => ({ name }))
          : [];
        setBatches(batchRecords.length ? batchRecords : fallbackBatches);

        const examRecords = Array.isArray(exams) ? exams : [];
        const gradeCounts = examRecords.reduce((counts, exam) => {
          const grade = exam.grade || "Unknown";
          counts[grade] = (counts[grade] || 0) + 1;
          return counts;
        }, {});
        const marksTotal = examRecords.reduce(
          (total, exam) =>
            total +
            (Number(exam.total) > 0
              ? (Number(exam.marks || 0) / Number(exam.total)) * 100
              : 0),
          0,
        );
        const gpaTotal = examRecords.reduce(
          (total, exam) => total + Number(exam.gpa || 0),
          0,
        );

        setSummary({
          students: Array.isArray(students) ? students.length : 0,
          teachers: Array.isArray(teachers) ? teachers.length : 0,
          fees: feeReport?.summary || {
            totalAmount: 0,
            totalPaid: 0,
            totalDue: 0,
            statusCounts: {},
          },
          attendance: {
            totalRecords: attendanceReport?.totalRecords || 0,
            present: attendanceReport?.present || 0,
            absent: attendanceReport?.absent || 0,
            percentage: attendanceReport?.percentage || 0,
          },
          exams: {
            total: examRecords.length,
            averageMarks: examRecords.length
              ? marksTotal / examRecords.length
              : 0,
            averageGpa: examRecords.length ? gpaTotal / examRecords.length : 0,
            gradeCounts,
          },
        });
      } catch (err) {
        console.error("Reports loading error:", err);
        setError("Unable to load report summary.");
      } finally {
        setLoading(false);
      }
    }

    loadSummary();
  }, []);

  async function applyAttendanceFilter(event, filterOverrides) {
    event.preventDefault();

    const params = {};
    const month = filterOverrides?.month ?? attendanceMonth;
    const batch = filterOverrides?.batch ?? attendanceBatch;
    if (month) params.month = month;
    if (batch) params.batch = batch;

    try {
      setAttendanceLoading(true);
      setError("");
      const attendanceReport = await getAttendanceReport(params);
      updateAttendanceSummary(attendanceReport);
    } catch (err) {
      console.error("Attendance report filter error:", err);
      setError("Unable to load filtered attendance report.");
    } finally {
      setAttendanceLoading(false);
    }
  }

  function clearAttendanceFilter() {
    setAttendanceMonth("");
    setAttendanceBatch("");
    applyAttendanceFilter({ preventDefault() {} }, { month: "", batch: "" });
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Header */}
          <div className="rounded-2xl border-2 border-primary-200 bg-white p-8 shadow-lg">
            <h1 className="text-3xl font-bold text-primary-900">Reports</h1>

            <p className="mt-2 text-gray-600">
              View summary reports and filter attendance statistics.
            </p>
          </div>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                Attendance Filters
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Filter attendance statistics by month and batch.
              </p>
            </div>
            <form
              onSubmit={applyAttendanceFilter}
              className="grid grid-cols-1 gap-4 md:grid-cols-3 md:items-end"
            >
              <label className="text-sm font-medium text-gray-700">
                Month
                <input
                  type="month"
                  value={attendanceMonth}
                  onChange={(event) => setAttendanceMonth(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 font-normal outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                />
              </label>
              <label className="text-sm font-medium text-gray-700">
                Batch
                <select
                  value={attendanceBatch}
                  onChange={(event) => setAttendanceBatch(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 font-normal outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                >
                  <option value="">All Batches</option>
                  {batches.map((batch) => {
                    const value = batch.name || batch.id;
                    return (
                      <option key={batch.id || value} value={value}>
                        {value}
                      </option>
                    );
                  })}
                </select>
              </label>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={attendanceLoading}
                  className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {attendanceLoading ? "Applying..." : "Apply Filter"}
                </button>
                {(attendanceMonth || attendanceBatch) && (
                  <button
                    type="button"
                    onClick={clearAttendanceFilter}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Clear
                  </button>
                )}
              </div>
            </form>
          </section>

          {/* Summary */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
            {loading ? (
              <p className="text-sm text-gray-500">Loading reports...</p>
            ) : error ? (
              <p className="text-sm text-red-600">{error}</p>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                {/* Students */}
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
                  <p className="text-sm text-gray-600">Students</p>

                  <p className="mt-2 text-3xl font-bold text-blue-900">
                    {summary.students}
                  </p>
                </div>

                {/* Teachers */}
                <div className="rounded-xl border border-green-200 bg-green-50 p-6">
                  <p className="text-sm text-gray-600">Teachers</p>

                  <p className="mt-2 text-3xl font-bold text-green-900">
                    {summary.teachers}
                  </p>
                </div>

                {/* Fees */}
                <div className="rounded-xl border border-orange-200 bg-orange-50 p-6">
                  <p className="text-sm text-gray-600">Total Fees</p>

                  <p className="mt-2 text-3xl font-bold text-orange-900">
                    Rs. {Number(summary.fees.totalAmount || 0).toLocaleString()}
                  </p>
                </div>

                {/* Exams */}
                <div className="rounded-xl border border-purple-200 bg-purple-50 p-6">
                  <p className="text-sm text-gray-600">Total Results</p>

                  <p className="mt-2 text-3xl font-bold text-purple-900">
                    {summary.exams.total}
                  </p>
                </div>
              </div>
            )}
          </div>

          {!loading && !error && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <section className="rounded-2xl border border-green-200 bg-white p-6 shadow-lg">
                <h2 className="text-lg font-bold text-gray-900">Fee Summary</h2>
                <div className="mt-4 space-y-2 text-sm">
                  <p className="flex justify-between">
                    <span>Total paid</span>
                    <strong>
                      Rs. {Number(summary.fees.totalPaid || 0).toLocaleString()}
                    </strong>
                  </p>
                  <p className="flex justify-between">
                    <span>Total due</span>
                    <strong>
                      Rs. {Number(summary.fees.totalDue || 0).toLocaleString()}
                    </strong>
                  </p>
                  <p className="flex justify-between">
                    <span>Paid / Partial / Due</span>
                    <strong>
                      {summary.fees.statusCounts?.paid || 0} /{" "}
                      {summary.fees.statusCounts?.partial || 0} /{" "}
                      {summary.fees.statusCounts?.due || 0}
                    </strong>
                  </p>
                </div>
              </section>

              <section className="rounded-2xl border border-blue-200 bg-white p-6 shadow-lg">
                <h2 className="text-lg font-bold text-gray-900">
                  Attendance Summary
                </h2>
                <div className="mt-4 space-y-2 text-sm">
                  <p className="flex justify-between">
                    <span>Total records</span>
                    <strong>{summary.attendance.totalRecords}</strong>
                  </p>
                  <p className="flex justify-between">
                    <span>Present / Absent</span>
                    <strong>
                      {summary.attendance.present} / {summary.attendance.absent}
                    </strong>
                  </p>
                  <p className="flex justify-between">
                    <span>Attendance rate</span>
                    <strong>{summary.attendance.percentage}%</strong>
                  </p>
                </div>
                {!summary.attendance.totalRecords &&
                  (attendanceMonth || attendanceBatch) && (
                    <p className="mt-4 text-sm text-gray-500">
                      No attendance records found for the selected filters.
                    </p>
                  )}
              </section>

              <section className="rounded-2xl border border-purple-200 bg-white p-6 shadow-lg">
                <h2 className="text-lg font-bold text-gray-900">
                  Exam Summary
                </h2>
                <div className="mt-4 space-y-2 text-sm">
                  <p className="flex justify-between">
                    <span>Average marks</span>
                    <strong>{summary.exams.averageMarks.toFixed(2)}%</strong>
                  </p>
                  <p className="flex justify-between">
                    <span>Average GPA</span>
                    <strong>{summary.exams.averageGpa.toFixed(2)}</strong>
                  </p>
                  <p className="flex justify-between">
                    <span>Grade distribution</span>
                    <strong>
                      {Object.entries(summary.exams.gradeCounts)
                        .map(([grade, count]) => `${grade}: ${count}`)
                        .join(", ") || "—"}
                    </strong>
                  </p>
                </div>
              </section>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
