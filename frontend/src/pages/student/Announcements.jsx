import React, { useEffect, useState } from "react";
import { getAnnouncements } from "../../services/announcementService";

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    getAnnouncements().then(setAnnouncements).catch(console.error);
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Announcements</h1>
      <div className="space-y-4">
        {announcements.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {item.title}
                </h2>
                <p className="text-sm text-gray-500">{item.date}</p>
              </div>
              <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700">
                {item.role || "General"}
              </span>
            </div>
            <p className="mt-3 text-sm text-gray-700">{item.body}</p>
          </div>
        ))}
        {announcements.length === 0 && (
          <p className="text-sm text-gray-500">No announcements available.</p>
        )}
      </div>
    </div>
  );
}
