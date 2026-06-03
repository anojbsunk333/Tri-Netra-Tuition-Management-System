import React, { useEffect, useState } from "react";
import StudentSidebar from "../../components/layout/StudentSidebar";
import { getAnnouncements } from "../../services/announcementService";

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    getAnnouncements()
      .then(setAnnouncements)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudentSidebar />
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Announcements
            </h1>
            <p className="text-gray-600">
              Stay updated with the latest news and announcements from your
              school.
            </p>
          </div>

          {/* Announcements */}
          {loading ? (
            <div className="text-center text-gray-600 py-8">
              Loading announcements...
            </div>
          ) : announcements.length > 0 ? (
            <div className="space-y-4">
              {announcements.map((item) => (
                <div
                  key={item._id || item.id}
                  className="rounded-xl border border-gray-200 bg-white shadow-md hover:shadow-lg transition cursor-pointer"
                  onClick={() =>
                    setExpandedId(
                      expandedId === (item._id || item.id)
                        ? null
                        : item._id || item.id,
                    )
                  }
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h2 className="text-lg font-semibold text-gray-900">
                          {item.title}
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                          {typeof item.createdAt === "string"
                            ? new Date(item.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                },
                              )
                            : item.date}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700">
                          {item.role || "General"}
                        </span>
                        <span className="text-2xl">
                          {expandedId === (item._id || item.id) ? "▼" : "▶"}
                        </span>
                      </div>
                    </div>

                    {expandedId === (item._id || item.id) && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-gray-700 leading-relaxed">
                          {item.message || item.body}
                        </p>
                        {item.postedBy && (
                          <p className="text-sm text-gray-500 mt-3">
                            Posted by:{" "}
                            <span className="font-medium">{item.postedBy}</span>
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl bg-white p-12 text-center shadow-md border border-gray-100">
              <p className="text-lg text-gray-600 mb-2">
                📢 No announcements yet
              </p>
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
