import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";

import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../../services/studentService";
import { validateEmailFormat } from "../../utils/emailValidation";
import {
  INVALID_NEPAL_MOBILE_MESSAGE,
  isValidNepalMobile,
} from "../../utils/phoneValidation";

// =========================================================
// CONSTANTS
// =========================================================

const EMPTY_FORM = {
  name: "",
  email: "",
  class: "",
  batch: "",
  phone: "",
  parent: "",
  feeStatus: "due",
  password: "",
};

const CLASS_OPTIONS = Array.from({ length: 10 }, (_, index) =>
  String(index + 3),
);

const BATCH_OPTIONS = ["Morning", "Day", "Evening"];

const FEE_STATUS_OPTIONS = [
  {
    value: "due",
    label: "Due",
  },
  {
    value: "partial",
    label: "Partial",
  },
  {
    value: "paid",
    label: "Paid",
  },
];

// =========================================================
// HELPERS
// =========================================================

function getFeeStatusLabel(status) {
  switch (status) {
    case "paid":
      return "Paid";

    case "partial":
      return "Partial";

    case "due":
      return "Due";

    default:
      return "N/A";
  }
}

function getFeeStatusClasses(status) {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-700";

    case "partial":
      return "bg-yellow-100 text-yellow-700";

    case "due":
      return "bg-red-100 text-red-700";

    default:
      return "bg-gray-100 text-gray-600";
  }
}

// =========================================================
// COMPONENT
// =========================================================

export default function Students() {
  // =======================================================
  // STUDENTS
  // =======================================================
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);

  // =======================================================
  // GENERAL STATE
  // =======================================================

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =======================================================
  // FORM
  // =======================================================

  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // =======================================================
  // FILTERS
  // =======================================================

  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [batchFilter, setBatchFilter] = useState("");
  const [feeStatusFilter, setFeeStatusFilter] = useState("");

  // =======================================================
  // LOAD STUDENTS
  // =======================================================

  async function loadStudents() {
    try {
      setLoading(true);
      setError("");

      const data = await getStudents();

      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Unable to load students:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load students.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStudents();
  }, []);

  // =======================================================
  // FILTER STUDENTS
  // =======================================================

  const filteredStudents = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return students.filter((student) => {
      // ---------------------------------------------------
      // SEARCH
      // ---------------------------------------------------

      if (normalizedSearch) {
        const searchableText = [
          student.id,
          student.name,
          student.class,
          student.batch,
          student.phone,
          student.parent,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (!searchableText.includes(normalizedSearch)) {
          return false;
        }
      }

      // ---------------------------------------------------
      // CLASS FILTER
      // ---------------------------------------------------

      if (classFilter && String(student.class || "") !== String(classFilter)) {
        return false;
      }

      // ---------------------------------------------------
      // BATCH FILTER
      // ---------------------------------------------------

      if (
        batchFilter &&
        String(student.batch || "").toLowerCase() !==
          String(batchFilter).toLowerCase()
      ) {
        return false;
      }

      // ---------------------------------------------------
      // FEE STATUS FILTER
      // ---------------------------------------------------

      if (
        feeStatusFilter &&
        String(student.feeStatus || "").toLowerCase() !==
          String(feeStatusFilter).toLowerCase()
      ) {
        return false;
      }

      return true;
    });
  }, [students, search, classFilter, batchFilter, feeStatusFilter]);

  // =======================================================
  // STATISTICS
  // =======================================================

  const statistics = useMemo(() => {
    const total = students.length;

    const paid = students.filter(
      (student) => student.feeStatus === "paid",
    ).length;

    const partial = students.filter(
      (student) => student.feeStatus === "partial",
    ).length;

    const due = students.filter(
      (student) => student.feeStatus === "due",
    ).length;

    return {
      total,
      paid,
      partial,
      due,
    };
  }, [students]);

  // =======================================================
  // FILTER HELPERS
  // =======================================================

  const hasActiveFilters =
    search.trim() || classFilter || batchFilter || feeStatusFilter;

  function clearFilters() {
    setSearch("");
    setClassFilter("");
    setBatchFilter("");
    setFeeStatusFilter("");
  }

  // =======================================================
  // FORM
  // =======================================================

  function openAddForm() {
    setEditingStudent(null);
    setForm({ ...EMPTY_FORM });
    setShowForm(true);
    setError("");
    setSuccessMessage("");
  }

  function openEditForm(student) {
    setEditingStudent(student);

    setForm({
      name: student.name || "",
      email: student.email || "",
      class: student.class || "",
      batch: student.batch || "",
      phone: student.phone || "",
      parent: student.parent || "",
      feeStatus: student.feeStatus || "due",
      password: "",
    });

    setShowForm(true);
    setError("");
  }

  function closeForm() {
    if (saving) return;

    setShowForm(false);
    setEditingStudent(null);
    setForm({ ...EMPTY_FORM });
    setSuccessMessage("");
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // =======================================================
  // SAVE STUDENT
  // =======================================================

  async function handleSubmit(event) {
    event.preventDefault();

    if (form.phone.trim() && !isValidNepalMobile(form.phone)) {
      setError(INVALID_NEPAL_MOBILE_MESSAGE);
      return;
    }

    if (!form.name.trim()) {
      setError("Student name is required.");
      return;
    }

    if (!form.email.trim()) {
      setError("Student email is required.");
      return;
    }

    const emailUnchanged =
      editingStudent &&
      form.email.trim().toLowerCase() ===
        String(editingStudent.email || "")
          .trim()
          .toLowerCase();
    const emailError = emailUnchanged ? "" : validateEmailFormat(form.email);
    if (emailError) {
      setError(emailError);
      return;
    }

    if (!editingStudent) {
      if (!form.password) {
        setError("Temporary password is required.");
        return;
      }

      if (form.password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
      }
    }

    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      if (editingStudent) {
        await updateStudent(editingStudent.id, {
          ...form,
          email: form.email.trim().toLowerCase(),
        });
      } else {
        const created = await createStudent({
          ...form,
          email: form.email.trim().toLowerCase(),
        });
        const studentMessage = created?.success
          ? `Student account created successfully. Student ID: ${created.studentId || "N/A"}. Email: ${created.email || form.email}. Initial password: ${created.initialPassword || form.password}`
          : "Student account created successfully.";
        setSuccessMessage(studentMessage);
      }

      setShowForm(false);
      setEditingStudent(null);
      setForm({ ...EMPTY_FORM });

      await loadStudents();
    } catch (err) {
      console.error("Unable to save student:", err);

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to save student.";

      setError(message);
    } finally {
      setSaving(false);
    }
  }

  // =======================================================
  // DELETE STUDENT
  // =======================================================

  async function handleDelete(student) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${student.name} (${student.id})?`,
    );

    if (!confirmed) return;

    try {
      setError("");

      await deleteStudent(student.id);

      await loadStudents();
    } catch (err) {
      console.error("Unable to delete student:", err);

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to delete student.";

      setError(message);
    }
  }

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-6">
        <div className="mx-auto max-w-7xl">
          {/* =================================================
              HEADER
          ================================================= */}

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Students</h1>

              <p className="mt-1 text-sm text-gray-500">
                Manage student records, classes, batches and fee status.
              </p>
            </div>

            <button
              type="button"
              onClick={openAddForm}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              + Add Student
            </button>
          </div>

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="mb-5 flex items-start justify-between gap-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <span>{error}</span>

              <button
                type="button"
                onClick={() => setError("")}
                className="font-bold text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
              {successMessage}
            </div>
          )}

          {/* =================================================
              STATISTICS
          ================================================= */}

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {/* TOTAL */}

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Students
                  </p>

                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    {statistics.total}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-xl">
                  👥
                </div>
              </div>
            </div>

            {/* PAID */}

            <div className="rounded-2xl border border-green-200 bg-green-50 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Paid</p>

                  <p className="mt-2 text-3xl font-bold text-green-700">
                    {statistics.paid}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-xl">
                  ✓
                </div>
              </div>
            </div>

            {/* PARTIAL */}

            <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-700">Partial</p>

                  <p className="mt-2 text-3xl font-bold text-yellow-700">
                    {statistics.partial}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-100 text-xl">
                  ◐
                </div>
              </div>
            </div>

            {/* DUE */}

            <div className="rounded-2xl border border-red-200 bg-red-50 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-700">Due</p>

                  <p className="mt-2 text-3xl font-bold text-red-700">
                    {statistics.due}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-xl">
                  !
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              ADD / EDIT FORM
          ================================================= */}

          {showForm && (
            <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
              {/* FORM HEADER */}

              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {editingStudent ? "Edit Student" : "Add New Student"}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {editingStudent
                      ? `Update information for ${editingStudent.name}.`
                      : "Enter the student's basic information."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="text-sm text-gray-500 hover:text-gray-900 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>

              {/* FORM */}

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* NAME */}

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Student Name *
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter student name"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>

                  {/* EMAIL */}

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Email *
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="student@example.com"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>

                  {/* CLASS */}

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Class
                    </label>

                    <select
                      name="class"
                      value={form.class}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    >
                      <option value="">Select class</option>

                      {CLASS_OPTIONS.map((classNumber) => (
                        <option key={classNumber} value={classNumber}>
                          Class {classNumber}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* BATCH */}

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Batch
                    </label>

                    <select
                      name="batch"
                      value={form.batch}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    >
                      <option value="">Select batch</option>

                      {BATCH_OPTIONS.map((batch) => (
                        <option key={batch} value={batch}>
                          {batch}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* PHONE */}

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Phone (Optional)
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="98XXXXXXXX"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Enter a 10-digit number starting with 97 or 98.
                    </p>
                  </div>

                  {/* PARENT */}

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Parent / Guardian
                    </label>

                    <input
                      type="text"
                      name="parent"
                      value={form.parent}
                      onChange={handleChange}
                      placeholder="Parent or guardian name"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>

                  {/* FEE STATUS */}

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Fee Status
                    </label>

                    <select
                      name="feeStatus"
                      value={form.feeStatus}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    >
                      {FEE_STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* TEMPORARY PASSWORD */}

                  {!editingStudent && (
                    <div className="md:col-span-2">
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Temporary Password *
                      </label>

                      <input
                        type="text"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Set a temporary password"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      />
                    </div>
                  )}
                </div>

                {/* FORM ACTIONS */}

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeForm}
                    disabled={saving}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving
                      ? "Saving..."
                      : editingStudent
                        ? "Update Student"
                        : "Add Student"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* =================================================
              FILTERS
          ================================================= */}

          <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Search & Filters
                </h2>

                <p className="text-sm text-gray-500">
                  Find students by name, ID, class, batch or phone.
                </p>
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-800"
                >
                  Clear Filters
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* SEARCH */}

              <div className="lg:col-span-1">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Search
                </label>

                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    🔎
                  </span>

                  <input
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Name, ID, phone..."
                    className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
              </div>

              {/* CLASS */}

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Class
                </label>

                <select
                  value={classFilter}
                  onChange={(event) => setClassFilter(event.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                >
                  <option value="">All Classes</option>

                  {CLASS_OPTIONS.map((classNumber) => (
                    <option key={classNumber} value={classNumber}>
                      Class {classNumber}
                    </option>
                  ))}
                </select>
              </div>

              {/* BATCH */}

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Batch
                </label>

                <select
                  value={batchFilter}
                  onChange={(event) => setBatchFilter(event.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                >
                  <option value="">All Batches</option>

                  {BATCH_OPTIONS.map((batch) => (
                    <option key={batch} value={batch}>
                      {batch}
                    </option>
                  ))}
                </select>
              </div>

              {/* FEE STATUS */}

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Fee Status
                </label>

                <select
                  value={feeStatusFilter}
                  onChange={(event) => setFeeStatusFilter(event.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                >
                  <option value="">All Fee Status</option>

                  {FEE_STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* FILTER RESULT COUNT */}

            <div className="mt-4 flex flex-col gap-2 border-t border-gray-100 pt-4 text-sm sm:flex-row sm:items-center sm:justify-between">
              <p className="text-gray-500">
                Showing{" "}
                <span className="font-semibold text-gray-900">
                  {filteredStudents.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900">
                  {students.length}
                </span>{" "}
                students
              </p>

              {hasActiveFilters && (
                <p className="text-blue-600">Filters are active</p>
              )}
            </div>
          </div>

          {/* =================================================
              STUDENT TABLE
          ================================================= */}

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
            {loading ? (
              <div className="p-10 text-center">
                <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

                <p className="text-sm text-gray-500">Loading students...</p>
              </div>
            ) : students.length === 0 ? (
              <div className="p-10 text-center">
                <div className="mb-3 text-4xl">👥</div>

                <h3 className="font-semibold text-gray-900">
                  No students found
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Add your first student to begin managing records.
                </p>

                <button
                  type="button"
                  onClick={openAddForm}
                  className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  + Add Student
                </button>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="p-10 text-center">
                <div className="mb-3 text-4xl">🔍</div>

                <h3 className="font-semibold text-gray-900">
                  No matching students
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Try changing your search or filters.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-4 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  {/* TABLE HEADER */}

                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                        ID
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                        Student
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
                        Parent / Guardian
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                        Fee
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  {/* TABLE BODY */}

                  <tbody className="divide-y divide-gray-100 bg-white">
                    {filteredStudents.map((student) => (
                      <tr
                        key={student.id}
                        className="transition hover:bg-gray-50"
                      >
                        {/* ID */}

                        <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-gray-700">
                          {student.id}
                        </td>

                        {/* NAME */}

                        <td className="px-4 py-4">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {student.name}
                            </p>

                            <p className="mt-0.5 text-xs text-gray-400">
                              {student.parent
                                ? `Guardian: ${student.parent}`
                                : "No guardian information"}
                            </p>
                          </div>
                        </td>

                        {/* CLASS */}

                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
                          {student.class ? (
                            <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                              Class {student.class}
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>

                        {/* BATCH */}

                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
                          {student.batch || "—"}
                        </td>

                        {/* PHONE */}

                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
                          {student.phone || "—"}
                        </td>

                        {/* PARENT */}

                        <td className="px-4 py-4 text-sm text-gray-700">
                          {student.parent || "—"}
                        </td>

                        {/* FEE */}

                        <td className="whitespace-nowrap px-4 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getFeeStatusClasses(
                              student.feeStatus,
                            )}`}
                          >
                            {getFeeStatusLabel(student.feeStatus)}
                          </span>
                        </td>

                        {/* ACTIONS */}

                        <td className="whitespace-nowrap px-4 py-4">
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() =>
                                navigate(`/admin/students/${student.id}`)
                              }
                              className="rounded-md border border-green-200 px-3 py-1 text-xs font-medium text-green-600 hover:bg-green-50"
                            >
                              View
                            </button>

                            <button
                              onClick={() => openEditForm(student)}
                              className="rounded-md border border-blue-200 px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => handleDelete(student)}
                              className="rounded-md border border-red-200 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* =================================================
              FOOTER INFO
          ================================================= */}

          {!loading && filteredStudents.length > 0 && (
            <div className="mt-4 flex flex-col gap-2 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
              <p>
                Total records:{" "}
                <span className="font-semibold text-gray-700">
                  {students.length}
                </span>
              </p>

              <p>
                Displaying:{" "}
                <span className="font-semibold text-gray-700">
                  {filteredStudents.length}
                </span>
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
