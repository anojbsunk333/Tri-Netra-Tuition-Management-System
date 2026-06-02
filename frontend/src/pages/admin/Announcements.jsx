import React, { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import { getAnnouncements } from "../../services/announcementService";

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
