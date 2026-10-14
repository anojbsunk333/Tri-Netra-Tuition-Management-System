import React, { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import {
  createTeacher,
  deleteTeacher,
  getTeachers,
  updateTeacher,
} from "../../services/teacherService";
import { validateEmailFormat } from "../../utils/emailValidation";
import {
  INVALID_NEPAL_MOBILE_MESSAGE,
  isValidNepalMobile,
} from "../../utils/phoneValidation";

const EMPTY_FORM = {
  name: "",
  subject: "",
  batch: "",
  phone: "",
  email: "",
  password: "",
  classes: "",
};

function parseClasses(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  async function loadTeachers() {
    try {
      setLoading(true);
      setError("");
      const data = await getTeachers();
      setTeachers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to load teachers.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTeachers();
  }, []);

  function resetForm() {
    setShowForm(false);
    setEditingTeacher(null);
    setForm(EMPTY_FORM);
    setSuccessMessage("");
  }

  function onFieldChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function openAddForm() {
    setEditingTeacher(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
    setError("");
  }

  function openEditForm(teacher) {
    setEditingTeacher(teacher);
    setForm({
      name: teacher.name || "",
      subject: teacher.subject || "",
      batch: teacher.batch || "",
      phone: teacher.phone || "",
      email: teacher.email || "",
      password: "",
      classes: Array.isArray(teacher.classes) ? teacher.classes.join(", ") : "",
    });
    setShowForm(true);
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (form.phone.trim() && !isValidNepalMobile(form.phone)) {
      setError(INVALID_NEPAL_MOBILE_MESSAGE);
      return;
    }

    if (!form.name.trim() || !form.subject.trim()) {
      setError("Teacher name and subject are required.");
      return;
    }

    if (!form.email.trim()) {
      setError("Teacher email is required.");
      return;
    }

    const emailUnchanged =
      editingTeacher &&
      form.email.trim().toLowerCase() ===
        String(editingTeacher.email || "")
          .trim()
          .toLowerCase();
    const emailError = emailUnchanged ? "" : validateEmailFormat(form.email);
    if (emailError) {
      setError(emailError);
      return;
    }

    if (!editingTeacher && !form.password) {
      setError("Temporary password is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");
      const payload = {
        ...form,
        email: form.email.trim().toLowerCase(),
        classes: parseClasses(form.classes),
      };

      if (editingTeacher) {
        await updateTeacher(editingTeacher.id, payload);
        setSuccessMessage("Teacher updated successfully.");
      } else {
        const created = await createTeacher(payload);
        const teacherMessage = created?.initialPassword
          ? `Teacher account created successfully. Email: ${created.email || form.email}. Initial password: ${created.initialPassword}`
          : "Teacher account created successfully.";
        setSuccessMessage(teacherMessage);
      }

      resetForm();
      await loadTeachers();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to save teacher.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(teacher) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${teacher.name} (${teacher.teacherCode || "this teacher"})?`,
    );
    if (!confirmed) return;

    try {
      setError("");
      await deleteTeacher(teacher.id);
      await loadTeachers();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to delete teacher.",
      );
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="rounded-2xl bg-white p-8 shadow-lg border-2 border-primary-200 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary-900">Teachers</h1>
              <p className="text-gray-600 mt-2">
                Monitor teacher assignments and subject coverage.
              </p>
            </div>
            <button
              type="button"
              onClick={openAddForm}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              + Add Teacher
            </button>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
              {successMessage}
            </div>
          )}

          {showForm && (
            <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-200">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {editingTeacher ? "Edit Teacher" : "Add New Teacher"}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {editingTeacher
                      ? `Update information for ${editingTeacher.name}.`
                      : "Create a teacher account and assign the primary batch."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-sm text-gray-500 hover:text-gray-900"
                >
                  Cancel
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className="grid gap-4 md:grid-cols-2"
              >
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={onFieldChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={onFieldChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Batch
                  </label>
                  <input
                    type="text"
                    name="batch"
                    value={form.batch}
                    onChange={onFieldChange}
                    placeholder="Morning"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={onFieldChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Enter a 10-digit number starting with 97 or 98.
                  </p>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Email {!editingTeacher && "*"}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={onFieldChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5"
                  />
                </div>

                {!editingTeacher && (
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Temporary Password *
                    </label>
                    <input
                      type="text"
                      name="password"
                      value={form.password}
                      onChange={onFieldChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5"
                    />
                  </div>
                )}

                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Classes
                  </label>
                  <input
                    type="text"
                    name="classes"
                    value={form.classes}
                    onChange={onFieldChange}
                    placeholder="9, 10, 11"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5"
                  />
                </div>

                <div className="md:col-span-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    {saving
                      ? "Saving..."
                      : editingTeacher
                        ? "Update Teacher"
                        : "Add Teacher"}
                  </button>
                </div>
              </form>
            </div>
          )}

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
                        Teacher ID
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
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {teachers.map((teacher) => (
                      <tr key={teacher.id}>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {teacher.teacherCode || "-"}
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
                        <td className="px-4 py-3 text-sm">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => openEditForm(teacher)}
                              className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(teacher)}
                              className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700"
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
        </div>
      </main>
    </div>
  );
}
