import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentSidebar from "../../components/layout/StudentSidebar";
import { useAuth } from "../../context/AuthContext";
import { getMyStudentOverview } from "../../services/studentPortalService";
import { getAnnouncements } from "../../services/announcementService";

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyStudentOverview().then(setData).catch(() => setError("Unable to load your dashboard."));
    getAnnouncements().then((items) => setAnnouncements(Array.isArray(items) ? items : [])).catch(() => {});
  }, []);

  if (error) return <div className="flex min-h-screen bg-gray-50"><StudentSidebar /><main className="flex-1 p-6"><p className="text-red-600">{error}</p></main></div>;
  if (!data) return <div className="flex min-h-screen bg-gray-50"><StudentSidebar /><main className="flex-1 p-6">Loading dashboard...</main></div>;

  const attendance = data.attendance || [];
  const present = attendance.filter((item) => item.status === "present").length;
  const attendanceRate = attendance.length ? Math.round((present / attendance.length) * 100) : 0;
  const exams = data.exams || [];
  const averageGpa = exams.length ? (exams.reduce((sum, item) => sum + Number(item.gpa || 0), 0) / exams.length).toFixed(2) : "—";
  const fees = data.fees || [];
  const outstanding = fees.reduce((sum, item) => sum + Number(item.due ?? (Number(item.amount) - Number(item.paid))), 0);

  return <div className="flex min-h-screen bg-gray-50"><StudentSidebar /><main className="flex-1 p-6"><div className="max-w-7xl mx-auto">
    <div className="mb-8 rounded-2xl bg-gradient-to-r from-primary-600 to-indigo-700 p-8 text-white"><h1 className="text-3xl font-bold">Welcome, {user?.name}!</h1><p className="mt-2">{data.student ? `Class ${data.student.class || "—"} · ${data.student.batch || "—"} · ID ${data.student.id}` : "Your account is awaiting student-record linking."}</p></div>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">{[["Attendance", `${attendanceRate}%`, "/student/attendance"], ["Average GPA", averageGpa, "/student/results"], ["Outstanding fees", `Rs. ${outstanding.toLocaleString()}`, "/student/fees"], ["Published results", exams.length, "/student/results"]].map(([label, value, path]) => <button key={label} onClick={() => navigate(path)} className="rounded-xl bg-white text-left p-6 shadow border hover:border-primary-400"><p className="text-gray-600 text-sm">{label}</p><p className="text-3xl font-bold text-primary-900 mt-2">{value}</p><span className="text-sm text-primary-700">View details →</span></button>)}</div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"><section className="rounded-xl bg-white shadow border p-6"><h2 className="text-xl font-bold mb-4">Recent results</h2>{exams.length ? <div className="space-y-3">{exams.slice(0, 5).map((item) => <div key={item.id} className="flex justify-between border-b pb-3"><span>{item.subject}</span><strong>{item.marks}/{item.total} · {item.grade}</strong></div>)}</div> : <p className="text-gray-500">No results published yet.</p>}</section><section className="rounded-xl bg-white shadow border p-6"><h2 className="text-xl font-bold mb-4">Latest announcements</h2>{announcements.length ? <div className="space-y-3">{announcements.slice(0, 3).map((item) => <div key={item.id} className="border-b pb-3 last:border-0"><p className="font-medium text-gray-800">{item.title}</p><p className="mt-1 text-sm text-gray-500">{item.body}</p></div>)}</div> : <p className="text-gray-500">No announcements yet.</p>}<button onClick={() => navigate("/student/announcements")} className="mt-4 text-primary-700 font-medium">View all announcements →</button></section></div>
  </div></main></div>;
}
