import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../api/axios";

export default function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStudent() {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(`/api/students/${id}`);

        setStudent(response.data);
      } catch (err) {
        console.error("Failed to load student:", err);

        const message =
          err?.response?.data?.message || "Unable to load student profile.";

        setError(message);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadStudent();
    }
  }, [id]);

  function getFeeStatusClass(status) {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700";

      case "partial":
        return "bg-yellow-100 text-yellow-700";

      case "due":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  function formatDate(date) {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <p className="text-sm text-gray-500">Loading student profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="mx-auto max-w-6xl">
          <button
            onClick={() => navigate("/admin/students")}
            className="mb-6 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            ← Back to Students
          </button>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <h2 className="text-lg font-semibold text-red-800">
              Unable to Load Student
            </h2>

            <p className="mt-2 text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="mx-auto max-w-6xl">
          <button
            onClick={() => navigate("/admin/students")}
            className="mb-6 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            ← Back to Students
          </button>

          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              Student Not Found
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              No student was found with ID: {id}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-6xl">
        {/* Back Button */}
        <button
          onClick={() => navigate("/admin/students")}
          className="mb-6 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          ← Back to Students
        </button>

        {/* Profile Header */}
        <div className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                {/* Student Avatar */}
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-2xl font-bold text-blue-600 shadow-md">
                  {student.name ? student.name.charAt(0).toUpperCase() : "S"}
                </div>

                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {student.name}
                  </h1>

                  <p className="mt-1 text-sm text-blue-100">
                    Student ID: {student.id}
                  </p>
                </div>
              </div>

              <div>
                <span
                  className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold capitalize ${getFeeStatusClass(
                    student.feeStatus,
                  )}`}
                >
                  Fee: {student.feeStatus || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Information */}
          <div className="grid grid-cols-1 divide-y divide-gray-200 md:grid-cols-3 md:divide-x md:divide-y-0">
            <div className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Class
              </p>

              <p className="mt-1 text-lg font-semibold text-gray-900">
                {student.class || "N/A"}
              </p>
            </div>

            <div className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Batch
              </p>

              <p className="mt-1 text-lg font-semibold text-gray-900">
                {student.batch || "N/A"}
              </p>
            </div>

            <div className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Joined
              </p>

              <p className="mt-1 text-lg font-semibold text-gray-900">
                {formatDate(student.joined)}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Personal Information */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-gray-900">
                Personal Information
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Basic information about the student.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Full Name
                </p>

                <p className="mt-1 text-sm font-medium text-gray-900">
                  {student.name || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Student ID
                </p>

                <p className="mt-1 text-sm font-medium text-gray-900">
                  {student.id || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Phone
                </p>

                <p className="mt-1 text-sm font-medium text-gray-900">
                  {student.phone || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Parent / Guardian
                </p>

                <p className="mt-1 text-sm font-medium text-gray-900">
                  {student.parent || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Class
                </p>

                <p className="mt-1 text-sm font-medium text-gray-900">
                  {student.class || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Batch
                </p>

                <p className="mt-1 text-sm font-medium text-gray-900">
                  {student.batch || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Joining Date
                </p>

                <p className="mt-1 text-sm font-medium text-gray-900">
                  {formatDate(student.joined)}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Fee Status
                </p>

                <span
                  className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getFeeStatusClass(
                    student.feeStatus,
                  )}`}
                >
                  {student.feeStatus || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Academic Summary */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-gray-900">
                Academic Summary
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Current student performance.
              </p>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl bg-blue-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                  GPA
                </p>

                <p className="mt-1 text-3xl font-bold text-blue-700">
                  {student.gpa ?? "0"}
                </p>
              </div>

              <div className="rounded-xl bg-green-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-green-600">
                  Attendance
                </p>

                <p className="mt-1 text-3xl font-bold text-green-700">
                  {student.attendance ?? "0"}%
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Fee Status
                </p>

                <p className="mt-1 text-lg font-bold capitalize text-gray-900">
                  {student.feeStatus || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Future Modules */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <FutureModule
            title="Attendance"
            description="View detailed attendance records."
          />

          <FutureModule
            title="Fees"
            description="View payments, installments and dues."
          />

          <FutureModule
            title="Exams & Results"
            description="View exam marks and academic results."
          />

          <FutureModule
            title="Documents"
            description="Student ID card and other documents."
          />
        </div>
      </div>
    </div>
  );
}

function FutureModule({ title, description }) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-5 shadow-sm">
      <h3 className="font-semibold text-gray-900">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-gray-500">{description}</p>

      <span className="mt-4 inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
        Coming next
      </span>
    </div>
  );
}
