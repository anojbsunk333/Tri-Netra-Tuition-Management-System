import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import { getStudent } from "../../services/studentService";

function formatDate(date) {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "—";
  }

  return parsed.toLocaleDateString("en-GB");
}

function getFeeStatusClasses(status) {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-700";

    case "partial":
      return "bg-yellow-100 text-yellow-700";

    case "due":
    default:
      return "bg-red-100 text-red-700";
  }
}

function getAttendanceColor(attendance) {
  const value = Number(attendance || 0);

  if (value >= 80) {
    return "text-green-600";
  }

  if (value >= 60) {
    return "text-yellow-600";
  }

  return "text-red-600";
}

export default function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadStudent() {
    try {
      setLoading(true);
      setError("");

      const data = await getStudent(id);

      setStudent(data);
    } catch (err) {
      console.error("Unable to load student profile:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load student profile.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) {
      loadStudent();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />

        <main className="flex-1 p-6">
          <div className="mx-auto max-w-6xl">
            <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-lg">
              <p className="text-sm text-gray-500">
                Loading student profile...
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />

        <main className="flex-1 p-6">
          <div className="mx-auto max-w-6xl">
            <button
              type="button"
              onClick={() => navigate("/students")}
              className="mb-5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              ← Back to Students
            </button>

            <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
              <h2 className="text-lg font-bold text-red-800">
                Unable to load student
              </h2>

              <p className="mt-2 text-sm text-red-700">
                {error || "Student not found."}
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const attendance = Number(student.attendance || 0);
  const gpa = Number(student.gpa || 0);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-6">
        <div className="mx-auto max-w-6xl">
          {/* HEADER */}

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <button
                type="button"
                onClick={() => navigate("/students")}
                className="mb-3 text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                ← Back to Students
              </button>

              <h1 className="text-2xl font-bold text-gray-900">
                Student Profile
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                View complete student information and academic overview.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate(`/students/${student.id}/edit`)}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Edit Student
            </button>
          </div>

          {/* PROFILE HEADER CARD */}

          <div className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                {/* AVATAR */}

                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-white text-3xl font-bold text-blue-600 shadow-lg">
                  {student.name ? student.name.charAt(0).toUpperCase() : "S"}
                </div>

                <div className="text-white">
                  <h2 className="text-2xl font-bold">
                    {student.name || "Unnamed Student"}
                  </h2>

                  <p className="mt-1 text-sm text-blue-100">
                    Student ID: {student.id}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {student.class && (
                      <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
                        Class {student.class}
                      </span>
                    )}

                    {student.batch && (
                      <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
                        {student.batch}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* BASIC INFO */}

            <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2 lg:grid-cols-4">
              <InfoItem label="Student ID" value={student.id} />

              <InfoItem
                label="Class"
                value={student.class ? `Class ${student.class}` : "—"}
              />

              <InfoItem label="Batch" value={student.batch || "—"} />

              <InfoItem
                label="Joined Date"
                value={formatDate(student.joined)}
              />
            </div>
          </div>

          {/* MAIN GRID */}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* PERSONAL INFORMATION */}

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg lg:col-span-2">
              <h2 className="mb-5 text-lg font-bold text-gray-900">
                Personal Information
              </h2>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <InfoItem label="Student Name" value={student.name || "—"} />

                <InfoItem
                  label="Phone"
                  value={student.phone || "Not provided"}
                />

                <InfoItem
                  label="Parent / Guardian"
                  value={student.parent || "Not provided"}
                />

                <InfoItem label="Student ID" value={student.id || "—"} />

                <InfoItem
                  label="Class"
                  value={student.class ? `Class ${student.class}` : "—"}
                />

                <InfoItem label="Batch" value={student.batch || "—"} />
              </div>
            </div>

            {/* FEE STATUS */}

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
              <h2 className="mb-5 text-lg font-bold text-gray-900">
                Fee Status
              </h2>

              <div className="rounded-xl bg-gray-50 p-5 text-center">
                <span
                  className={`inline-flex rounded-full px-4 py-2 text-sm font-bold capitalize ${getFeeStatusClasses(
                    student.feeStatus,
                  )}`}
                >
                  {student.feeStatus || "due"}
                </span>

                <p className="mt-4 text-sm text-gray-500">Current fee status</p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/fees")}
                className="mt-5 w-full rounded-lg border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50"
              >
                View Fee Records
              </button>
            </div>
          </div>

          {/* ACADEMIC OVERVIEW */}

          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900">
                Academic Overview
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Current academic performance summary.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* ATTENDANCE */}

              <div className="rounded-xl border border-gray-200 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Attendance
                    </p>

                    <p
                      className={`mt-2 text-3xl font-bold ${getAttendanceColor(
                        attendance,
                      )}`}
                    >
                      {attendance}%
                    </p>
                  </div>

                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-xl">
                    📅
                  </div>
                </div>

                <div className="mt-5 h-2 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all"
                    style={{
                      width: `${Math.min(Math.max(attendance, 0), 100)}%`,
                    }}
                  />
                </div>

                <p className="mt-2 text-xs text-gray-500">
                  Attendance percentage
                </p>
              </div>

              {/* GPA */}

              <div className="rounded-xl border border-gray-200 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">GPA</p>

                    <p className="mt-2 text-3xl font-bold text-purple-600">
                      {gpa.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-50 text-xl">
                    🎓
                  </div>
                </div>

                <p className="mt-5 text-xs text-gray-500">
                  Current Grade Point Average
                </p>
              </div>
            </div>
          </div>

          {/* QUICK ACTIONS */}

          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
            <h2 className="mb-5 text-lg font-bold text-gray-900">
              Quick Actions
            </h2>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <button
                type="button"
                onClick={() => navigate(`/students/${student.id}/edit`)}
                className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-100"
              >
                Edit Student
              </button>

              <button
                type="button"
                onClick={() => navigate("/fees")}
                className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 hover:bg-green-100"
              >
                Fee Records
              </button>

              <button
                type="button"
                disabled
                className="cursor-not-allowed rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-400"
              >
                Attendance
              </button>

              <button
                type="button"
                disabled
                className="cursor-not-allowed rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-400"
              >
                Exam Results
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-gray-900">{value || "—"}</p>
    </div>
  );
}
