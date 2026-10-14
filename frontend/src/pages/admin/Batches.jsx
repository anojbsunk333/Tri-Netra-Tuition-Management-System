import React, { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import { getTeachers } from "../../services/teacherService";
import {
  createBatch,
  deleteBatch,
  getBatches,
  updateBatch,
} from "../../services/batchService";

const EMPTY_FORM = {
  name: "",
  time: "",
  teacher: "",
  classes: "",
};

function parseClasses(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function Batches() {
  const [batches, setBatches] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  async function loadData() {
    try {
      setLoading(true);
      setError("");
      const [batchData, teacherData] = await Promise.all([
        getBatches(),
        getTeachers(),
      ]);
      setBatches(Array.isArray(batchData) ? batchData : []);
      setTeachers(Array.isArray(teacherData) ? teacherData : []);
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to load batches.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function resetForm() {
    setShowForm(false);
    setEditingBatch(null);
    setForm(EMPTY_FORM);
    setSuccessMessage("");
  }

  function onFieldChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function openAddForm() {
    setEditingBatch(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
    setError("");
  }

  function openEditForm(batch) {
    setEditingBatch(batch);
    setForm({
      name: batch.name || "",
      time: batch.time || "",
      teacher: batch.teacher || "",
      classes: Array.isArray(batch.classes) ? batch.classes.join(", ") : "",
    });
    setShowForm(true);
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.name.trim() || !form.time.trim()) {
      setError("Batch name and time are required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      const payload = {
        ...form,
        classes: parseClasses(form.classes),
      };

      if (editingBatch) {
        await updateBatch(editingBatch.id, payload);
        setSuccessMessage("Batch updated successfully.");
      } else {
        await createBatch(payload);
        setSuccessMessage("Batch created successfully.");
      }

      resetForm();
      await loadData();
    } catch (err) {
      setError(
        err?.response?.data?.message || err?.message || "Unable to save batch.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(batch) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${batch.name} (${batch.id})?`,
    );
    if (!confirmed) return;

    try {
      setError("");
      await deleteBatch(batch.id);
      await loadData();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to delete batch.",
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
              <h1 className="text-3xl font-bold text-primary-900">Batches</h1>
              <p className="text-gray-600 mt-2">
                Review batch schedules and class assignments.
              </p>
            </div>
            <button
              type="button"
              onClick={openAddForm}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              + Add Batch
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
                    {editingBatch ? "Edit Batch" : "Add New Batch"}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {editingBatch
                      ? `Update schedule settings for ${editingBatch.name}.`
                      : "Create a batch and assign the responsible teacher."}
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
                    Batch Name *
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
                    Time *
                  </label>
                  <input
                    type="text"
                    name="time"
                    value={form.time}
                    onChange={onFieldChange}
                    placeholder="6:00 AM – 8:00 AM"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Teacher
                  </label>
                  <select
                    name="teacher"
                    value={form.teacher}
                    onChange={onFieldChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5"
                  >
                    <option value="">Select teacher</option>
                    {teachers.map((teacher) => (
                      <option key={teacher.id} value={teacher.name}>
                        {teacher.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
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
                      : editingBatch
                        ? "Update Batch"
                        : "Add Batch"}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-200">
            {loading ? (
              <p className="text-sm text-gray-500">Loading batches...</p>
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
                        Batch
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                        Time
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                        Teacher
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                        Students
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {batches.map((batch) => (
                      <tr key={batch.id}>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {batch.id}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {batch.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {batch.time}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {batch.teacher}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {batch.students}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => openEditForm(batch)}
                              className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(batch)}
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
