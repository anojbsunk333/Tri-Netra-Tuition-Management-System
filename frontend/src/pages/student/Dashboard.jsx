import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import StudentSidebar from "../../components/layout/StudentSidebar";
import { getAttendanceRecords } from "../../services/attendanceService";
import { getExams } from "../../services/examService";
import { getFees } from "../../services/feeService";
import { getAnnouncements } from "../../services/announcementService";
import Badge from "../../components/Badge";
import { useNavigate } from "react-router-dom";

// Get greeting based on time
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
}

// Get motivational quotes
const motivationalQuotes = [
  "Success is not final, failure is not fatal. Keep studying!",
  "Your education is your greatest investment.",
  "Every expert was once a beginner. Keep learning!",
  "Believe in yourself and all that you are capable of.",
  "The future depends on what you do today.",
  "Education is the most powerful weapon of change.",
  "You are capable of amazing things.",
  "Consistency is the key to success.",
];

// Get Nepali date (simplified)
function getNepaliDate() {
  const today = new Date();
  // Simplified Nepali calendar display
  const months = [
    "Baisakh",
    "Jyaistha",
    "Asadh",
    "Shrawan",
    "Bhadra",
    "Ashwin",
    "Kartik",
    "Mangshir",
    "Poush",
    "Magh",
    "Phalgun",
    "Chaitra",
  ];
  const nepaliDate = today.getDate() + 56; // Approximate conversion
  const year = today.getFullYear() + 57; // Approximate conversion
  return `${months[today.getMonth()]}, 2082`;
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState(null);
  const [exams, setExams] = useState([]);
  const [fees, setFees] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [gpa, setGpa] = useState(3.6);
  const [expandedNotice, setExpandedNotice] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [attendanceData, examsData, feesData, announcementsData] =
          await Promise.all([
            getAttendanceRecords(),
            getExams(),
            getFees(),
            getAnnouncements(),
          ]);

        setAttendance(attendanceData || { percentage: 91 });
        setExams(Array.isArray(examsData) ? examsData.slice(0, 3) : []);
        setFees(feesData || { status: "paid", amount: 3000 });
        setAnnouncements(
          Array.isArray(announcementsData) ? announcementsData.slice(0, 3) : [],
        );
      } catch (error) {
        console.log("Using default data for dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading dashboard...</div>
      </div>
    );

  const greeting = getGreeting();
  const quote =
    motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
  const attendancePercent = attendance?.percentage || 91;
  const feeStatus = fees?.status || "paid";
  const newNotices = announcements.length;

  // Calculate attendance warning
  const attendanceWarning = attendancePercent < 75;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <StudentSidebar />
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* 1. Welcome Section */}
          <div className="mb-8 rounded-2xl bg-gradient-to-r from-primary-600 to-primary-700 text-white p-8 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  {greeting}, {user?.name || "Student"}! 👋
                </h1>
                <p className="text-primary-100 text-lg mb-3">
                  {user?.class || "Class"} · {user?.batch || "Batch"} · Roll No:{" "}
                  {user?.rollNumber || "S001"}
                </p>
                <p className="text-primary-200">{getNepaliDate()}</p>
              </div>
              <div className="hidden md:block text-right">
                <p className="text-4xl mb-2">
                  {greeting === "Good Morning"
                    ? "🌅"
                    : greeting === "Good Afternoon"
                      ? "☀️"
                      : "🌙"}
                </p>
                <p className="text-primary-100 italic text-sm max-w-xs">
                  "{quote}"
                </p>
              </div>
            </div>
          </div>

          {/* 2. Quick Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-6 border border-blue-200 shadow-md hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    📅 Attendance
                  </p>
                  <p className="text-3xl font-bold text-blue-900 mt-2">
                    {attendancePercent}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">This Month</p>
                </div>
                <div className="text-4xl">📅</div>
              </div>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 p-6 border border-purple-200 shadow-md hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">🏆 GPA</p>
                  <p className="text-3xl font-bold text-purple-900 mt-2">
                    {gpa}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Last Test</p>
                </div>
                <div className="text-4xl">🏆</div>
              </div>
            </div>

            <div
              className={`rounded-xl p-6 border shadow-md hover:shadow-lg transition ${
                feeStatus === "paid"
                  ? "bg-gradient-to-br from-green-50 to-green-100 border-green-200"
                  : feeStatus === "due"
                    ? "bg-gradient-to-br from-red-50 to-red-100 border-red-200"
                    : "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    💳 Fee Status
                  </p>
                  <p
                    className={`text-3xl font-bold mt-2 capitalize ${
                      feeStatus === "paid"
                        ? "text-green-900"
                        : feeStatus === "due"
                          ? "text-red-900"
                          : "text-orange-900"
                    }`}
                  >
                    {feeStatus}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Current</p>
                </div>
                <div className="text-4xl">💳</div>
              </div>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-red-50 to-red-100 p-6 border border-red-200 shadow-md hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    📢 Announcements
                  </p>
                  <p className="text-3xl font-bold text-red-900 mt-2">
                    {newNotices}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">New Notices</p>
                </div>
                <div className="text-4xl">📢</div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* 3. Attendance Overview */}
              <div className="rounded-xl bg-white p-6 shadow-md border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    📈 Attendance Overview
                  </h3>
                  <button
                    onClick={() => navigate("/student/attendance")}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    View Details →
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-700 font-medium">
                      Monthly Attendance
                    </p>
                    <p className="text-lg font-bold text-primary-600">
                      {attendancePercent}%
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        attendancePercent >= 75
                          ? "bg-gradient-to-r from-green-400 to-green-600"
                          : "bg-gradient-to-r from-red-400 to-red-600"
                      }`}
                      style={{ width: `${Math.min(attendancePercent, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    20 days present out of 22 school days
                  </p>
                </div>

                {/* Attendance Warning */}
                {attendanceWarning && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 font-medium">
                      ⚠️ Attendance Warning: Your attendance is below 75%
                    </p>
                    <p className="text-sm text-red-600 mt-1">
                      Please improve your attendance immediately.
                    </p>
                  </div>
                )}

                {/* Simple Calendar Grid */}
                <div className="mt-6">
                  <p className="text-sm text-gray-600 font-medium mb-3">
                    Calendar View (Green = Present, Red = Absent)
                  </p>
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 22 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-10 rounded-lg flex items-center justify-center text-xs font-medium ${
                          Math.random() > 0.1
                            ? "bg-green-100 text-green-700 border border-green-300"
                            : "bg-red-100 text-red-700 border border-red-300"
                        }`}
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 4. Academic Performance */}
              <div className="rounded-xl bg-white p-6 shadow-md border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    🏆 Academic Performance
                  </h3>
                  <button
                    onClick={() => navigate("/student/results")}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    View Results →
                  </button>
                </div>

                {/* Subject Performance Chart (Bar Chart Simulation) */}
                <div className="space-y-4">
                  {[
                    { subject: "Mathematics", marks: 88, grade: "A+" },
                    { subject: "Science", marks: 82, grade: "A" },
                    { subject: "English", marks: 75, grade: "B+" },
                    { subject: "Social Studies", marks: 90, grade: "A+" },
                  ].map((item) => (
                    <div key={item.subject}>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-gray-700 font-medium">
                          {item.subject}
                        </p>
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-gray-900">
                            {item.marks}
                          </span>
                          <Badge
                            status={
                              item.grade === "A+"
                                ? "paid"
                                : item.grade === "A"
                                  ? "paid"
                                  : "partial"
                            }
                          />
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all"
                          style={{ width: `${item.marks}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Overall GPA */}
                <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200 rounded-lg">
                  <p className="text-sm text-gray-600 font-medium">
                    Overall Performance
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-2xl font-bold text-primary-900">
                      GPA: {gpa}
                    </p>
                    <p className="text-sm text-primary-700">
                      Great job! Keep it up!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* 5. Fee Status Card */}
              <div
                className={`rounded-xl p-6 shadow-md border ${
                  feeStatus === "paid"
                    ? "bg-gradient-to-br from-green-50 to-green-100 border-green-200"
                    : feeStatus === "due"
                      ? "bg-gradient-to-br from-red-50 to-red-100 border-red-200"
                      : "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200"
                }`}
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  💳 Fee Status
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Current Month</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      Baisakh 2082
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Status</p>
                      <Badge status={feeStatus} />
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Amount</p>
                      <p className="text-xl font-bold text-gray-900">
                        Rs. 3,000
                      </p>
                    </div>
                  </div>
                  {feeStatus !== "paid" && (
                    <div className="p-3 bg-white bg-opacity-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-700">
                        Due Date: Baisakh 30, 2082
                      </p>
                    </div>
                  )}
                  <button className="w-full bg-primary-600 text-white py-2 rounded-lg font-medium hover:bg-primary-700 transition">
                    Download Receipt
                  </button>
                </div>
              </div>

              {/* 6. Latest Announcements */}
              <div className="rounded-xl bg-white p-6 shadow-md border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    📢 Announcements
                  </h3>
                  <button
                    onClick={() => navigate("/student/announcements")}
                    className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                  >
                    View All →
                  </button>
                </div>
                <div className="space-y-3">
                  {announcements.length > 0 ? (
                    announcements.map((notice) => (
                      <div
                        key={notice._id}
                        className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition cursor-pointer"
                        onClick={() =>
                          setExpandedNotice(
                            expandedNotice === notice._id ? null : notice._id,
                          )
                        }
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 text-sm">
                              {notice.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(notice.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span className="inline-block px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded-full">
                            New
                          </span>
                        </div>
                        {expandedNotice === notice._id && (
                          <p className="text-sm text-gray-700 mt-3 border-t pt-3">
                            {notice.message}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <div>
                      <p className="p-3 text-sm text-gray-500">
                        — Exam Schedule Coming Soon
                      </p>
                      <p className="p-3 text-sm text-gray-500">
                        — Fee Reminder Due
                      </p>
                      <p className="p-3 text-sm text-gray-500">
                        — Holiday Notice Announced
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* 7. ID Card Preview */}
              <div className="rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 p-6 text-white shadow-md border border-indigo-400">
                <h3 className="text-lg font-bold mb-4">🪪 My ID Card</h3>
                <div className="bg-white bg-opacity-10 backdrop-blur rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm opacity-90">Name</p>
                      <p className="font-bold">
                        {user?.name || "Student Name"}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl">📱</p>
                      <p className="text-xs opacity-75">QR Code</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm mt-3">
                    <div>
                      <p className="opacity-90">Class</p>
                      <p className="font-semibold">{user?.class || "10"}</p>
                    </div>
                    <div>
                      <p className="opacity-90">Batch</p>
                      <p className="font-semibold">
                        {user?.batch || "Morning"}
                      </p>
                    </div>
                    <div>
                      <p className="opacity-90">Roll No</p>
                      <p className="font-semibold">
                        {user?.rollNumber || "S001"}
                      </p>
                    </div>
                    <div>
                      <p className="opacity-90">Year</p>
                      <p className="font-semibold">2082</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 bg-white text-indigo-600 py-2 rounded-lg font-medium hover:bg-opacity-90 transition">
                    Download PDF
                  </button>
                  <button className="flex-1 bg-indigo-700 py-2 rounded-lg font-medium hover:bg-indigo-800 transition border border-white border-opacity-30">
                    Print
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 8. Today's Schedule & 9. Goals & Progress */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Today's Schedule */}
            <div className="rounded-xl bg-white p-6 shadow-md border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                📅 Today's Schedule
              </h3>
              <div className="space-y-3">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Morning Batch</p>
                      <p className="text-sm text-gray-600 mt-1">
                        7:30 AM - 1:30 PM
                      </p>
                    </div>
                    <span className="text-2xl">⏰</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">
                      📚 Mathematics (Period 1)
                    </p>
                    <p className="text-xs text-gray-600">
                      Teacher: Mr. Ram Kumar
                    </p>
                    <p className="text-xs text-primary-600 font-medium mt-1">
                      ⏱️ Starts in 2 hours 30 mins
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">
                      🔬 Science (Period 2)
                    </p>
                    <p className="text-xs text-gray-600">
                      Teacher: Ms. Priya Sharma
                    </p>
                    <p className="text-xs text-primary-600 font-medium mt-1">
                      ⏱️ Starts in 3 hours 30 mins
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Goals & Progress */}
            <div className="rounded-xl bg-white p-6 shadow-md border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                🎯 Weekly Goals
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-700 font-medium">
                      Attend 5 days this week
                    </p>
                    <p className="text-sm font-bold text-primary-600">4/5</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-400 to-primary-600"
                      style={{ width: "80%" }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Just 1 more day!</p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-700 font-medium">
                      Complete homework daily
                    </p>
                    <p className="text-sm font-bold text-primary-600">5/5</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-400 to-green-600"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                  <p className="text-xs text-green-600 font-medium mt-1">
                    ✅ Target Achieved! Great effort!
                  </p>
                </div>

                <div className="p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg border border-primary-200 mt-4">
                  <p className="text-sm font-medium text-primary-900">
                    💪 You're on track! Keep maintaining your excellent
                    progress.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 10. Quick Action Buttons */}
          <div className="rounded-xl bg-white p-6 shadow-md border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              ⚡ Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button
                onClick={() => navigate("/student/attendance")}
                className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 hover:shadow-lg transition font-medium text-blue-900"
              >
                📋 My Attendance
              </button>
              <button
                onClick={() => navigate("/student/results")}
                className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 hover:shadow-lg transition font-medium text-purple-900"
              >
                📝 My Results
              </button>
              <button
                onClick={() => navigate("/student/fees")}
                className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 hover:shadow-lg transition font-medium text-green-900"
              >
                💳 My Fees
              </button>
              <button
                onClick={() => navigate("/student/profile")}
                className="p-4 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 hover:shadow-lg transition font-medium text-orange-900"
              >
                🪪 My ID Card
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
