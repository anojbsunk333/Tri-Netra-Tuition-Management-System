import React, { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import { useAuth } from "../../context/AuthContext";
import {
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncements,
  updateAnnouncement,
} from "../../services/announcementService";

export default function Announcements() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadAnnouncements() {
      try {
        setLoading(true);
        const data = await getAnnouncements();
        setAnnouncements(data);
      } catch (err) {
        setError("Unable to load announcements.");
      } finally {
        setLoading(false);
      }
    }
    loadAnnouncements();
  }, []);

  function resetForm() {
    setTitle("");
    setBody("");
    setEditingId(null);
  }

  function startEditing(announcement) {
    setEditingId(announcement.id);
    setTitle(announcement.title || "");
    setBody(announcement.body || announcement.message || "");
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setSaving(true);
      setError("");
      const content = { title, body };
      const saved = editingId
        ? await updateAnnouncement(editingId, content)
        : await createAnnouncement(content);
      setAnnouncements((current) =>
        editingId
          ? current.map((item) => (item.id === editingId ? saved : item))
          : [saved, ...current],
      );
      resetForm();
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message || "Unable to save announcement.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this announcement?")) return;
    try {
      await deleteAnnouncement(id);
      setAnnouncements((current) => current.filter((item) => item.id !== id));
      if (editingId === id) resetForm();
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ||
          "Unable to delete announcement.",
      );
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="rounded-2xl bg-white p-8 shadow-lg border-2 border-primary-200">
            <h1 className="text-3xl font-bold text-primary-900">
              Announcements
            </h1>
            <p className="text-gray-600 mt-2">
              Manage the center’s announcements and notices.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-200">
            <form
              onSubmit={handleSubmit}
              className="mb-6 rounded-xl border border-primary-100 bg-primary-50 p-4"
            >
              <h2 className="text-lg font-semibold text-primary-900">
                {editingId ? "Edit Announcement" : "Create Announcement"}
              </h2>
              <div className="mt-3 grid gap-3">
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Announcement title"
                  required
                  className="rounded-lg border border-gray-300 px-3 py-2"
                />
                <textarea
                  value={body}
                  onChange={(event) => setBody(event.target.value)}
                  placeholder="Announcement details"
                  required
                  className="rounded-lg border border-gray-300 px-3 py-2"
                  rows="3"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    {saving
                      ? "Saving..."
                      : editingId
                        ? "Save Changes"
                        : "Post Announcement"}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="rounded-lg border border-gray-300 px-4 py-2 text-sm"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </form>
            {loading ? (
              <p className="text-sm text-gray-500">Loading announcements...</p>
            ) : error ? (
              <p className="text-sm text-red-600">{error}</p>
            ) : (
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <article
                    key={announcement.id}
                    className="rounded-2xl border border-gray-200 p-4 hover:shadow-sm transition"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <h2 className="text-lg font-semibold text-gray-900">
                        {announcement.title}
                      </h2>
                      <span className="text-xs uppercase text-gray-500">
                        {announcement.date}
                      </span>
                    </div>
                    <p className="mt-2 text-gray-600">{announcement.body}</p>
                    <p className="mt-3 text-sm text-gray-500">
                      Published by {announcement.author} • Role:{" "}
                      {announcement.role}
                    </p>
                    {user?.role === "admin" && (
                      <div className="mt-3 flex gap-2">
                        <button
                          type="button"
                          onClick={() => startEditing(announcement)}
                          className="rounded-lg border border-gray-300 px-3 py-1 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(announcement.id)}
                          className="rounded-lg bg-red-50 px-3 py-1 text-sm text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
