import React, { useEffect, useState } from "react";
import StudentSidebar from "../../components/layout/StudentSidebar";
import { getAnnouncements } from "../../services/announcementService";

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnnouncements()
      .then(setAnnouncements)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const formatAnnouncementDate = (item) => {
    const date = item.createdAt || item.date;
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return date || "Date unavailable";

    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(parsedDate);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudentSidebar />
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Announcements
            </h1>
            <p className="text-gray-600">
              Stay updated with the latest news and announcements from your
              school.
            </p>
          </div>

          {loading ? (
            <div className="py-8 text-center text-gray-600">
              Loading announcements...
            </div>
          ) : announcements.length > 0 ? (
            <div className="space-y-4">
              {announcements.map((item) => (
                <article
                  key={item._id || item.id}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-primary-200 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500">
                        {formatAnnouncementDate(item)}
                      </p>
                      <h2 className="mt-2 text-xl font-bold text-gray-900">
                        {item.title}
                      </h2>
                    </div>
                    <span className="shrink-0 rounded-full bg-primary-50 px-3 py-1.5 text-xs font-semibold capitalize tracking-wide text-primary-700 ring-1 ring-inset ring-primary-200">
                      {item.role || "General"}
                    </span>
                  </div>

                  <div className="mt-5 border-t border-gray-100 pt-4">
                    <p className="whitespace-pre-line text-base leading-7 text-gray-700">
                      {item.body || item.message}
                    </p>
                    {(item.author || item.postedBy) && (
                      <p className="mt-4 text-sm text-gray-500">
                        Posted by{" "}
                        <span className="font-medium text-gray-700">
                          {item.author || item.postedBy}
                        </span>
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-xl bg-white p-12 text-center shadow-md border border-gray-100">
              <p className="text-lg text-gray-600 mb-2">No announcements yet</p>
              <p className="text-sm text-gray-500">
                Check back later for updates from your school.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
