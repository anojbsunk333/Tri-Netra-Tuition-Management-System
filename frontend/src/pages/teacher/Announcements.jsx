import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import TeacherSidebar from "../../components/layout/TeacherSidebar";

export default function Announcements() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handlePostAnnouncement = () => {
    if (title.trim() && content.trim()) {
      const newAnnouncement = {
        id: Date.now(),
        title,
        content,
        author: user.name,
        date: new Date().toLocaleDateString(),
      };
      setAnnouncements([newAnnouncement, ...announcements]);
      setTitle("");
      setContent("");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <TeacherSidebar />
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-primary-900 mb-6">
            Announcements
          </h1>

          {/* Post Announcement Section */}
          <div className="rounded-2xl bg-white p-6 shadow-lg border-2 border-primary-200 mb-6">
            <h2 className="text-2xl font-semibold text-primary-900 mb-4">
              Post Notice
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Announcement title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
              />
              <textarea
                placeholder="Write your announcement here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 h-32"
              />
              <button
                onClick={handlePostAnnouncement}
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition font-semibold"
              >
                Post Announcement
              </button>
            </div>
          </div>

          {/* Announcements List */}
          <div className="space-y-4">
            {announcements.length === 0 ? (
              <div className="rounded-2xl bg-white p-8 shadow-lg border-2 border-primary-200 text-center">
                <p className="text-gray-600 text-lg">
                  No announcements yet. Post one above!
                </p>
              </div>
            ) : (
              announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="rounded-xl bg-white p-6 shadow-md border border-primary-100 hover:shadow-lg transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-primary-900">
                        {announcement.title}
                      </h3>
                      <p className="text-gray-600 mt-2">
                        {announcement.content}
                      </p>
                      <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                        <span>By {announcement.author}</span>
                        <span>{announcement.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
