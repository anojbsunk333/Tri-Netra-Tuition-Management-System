import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function TeacherSidebar() {
  const { setUser } = useAuth();
  const location = useLocation();

  const navItems = [
    { icon: "🏠", label: "Dashboard", path: "/teacher/dashboard" },
    { icon: "✅", label: "Take Attendance", path: "/teacher/attendance" },
    { icon: "🏆", label: "Enter Results", path: "/teacher/exams" },
    { icon: "📢", label: "Announcements", path: "/teacher/announcements" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 bg-white border-r border-primary-200 h-screen sticky top-0 flex flex-col">
      <div className="p-6 border-b border-primary-200">
        <h2 className="text-2xl font-bold text-primary-900">TRI·NETRA</h2>
        <p className="text-sm text-gray-600 mt-1">Teacher Portal</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              isActive(item.path)
                ? "bg-primary-100 text-primary-900 font-semibold border-l-4 border-primary-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-primary-200">
        <button
          onClick={() => setUser(null)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition font-semibold"
        >
          <span className="text-lg">🚪</span>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
