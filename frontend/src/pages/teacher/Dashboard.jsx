import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import TeacherSidebar from "../../components/layout/TeacherSidebar";
import { getStudents } from "../../services/studentService";
import { getAttendanceRecords } from "../../services/attendanceService";
import { getExams } from "../../services/examService";
import { getAnnouncements } from "../../services/announcementService";
import Badge from "../../components/Badge";

// Get greeting based on time
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
}

function getNepaliDate() {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());
}

export default function TeacherDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [exams, setExams] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [studentsData, attendanceData, examsData, announcementsData] =
          await Promise.all([
            getStudents(),
            getAttendanceRecords(),
            getExams(),
            getAnnouncements(),
          ]);

        setStudents(Array.isArray(studentsData) ? studentsData : []);
        setAttendance(Array.isArray(attendanceData) ? attendanceData : []);
        setExams(Array.isArray(examsData) ? examsData : []);
        setAnnouncements(
          Array.isArray(announcementsData) ? announcementsData : [],
        );
      } catch (error) {
        console.log("Using default data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (!user) return null;

  const totalStudents = students.length;
  const latestAttendanceDate = attendance.reduce(
    (latest, record) => (record.date > latest ? record.date : latest),
    "",
  );
  const latestAttendance = attendance.filter(
    (record) => record.date === latestAttendanceDate,
  );
  const presentToday = latestAttendance.filter(
    (record) => record.status === "present",
  ).length;
  const absentToday = latestAttendance.filter(
    (record) => record.status === "absent",
  ).length;
  const classAvgGpa = exams.length
    ? (
        exams.reduce((sum, exam) => sum + Number(exam.gpa || 0), 0) /
        exams.length
      ).toFixed(2)
    : "—";
  const announcementsThisMonth = announcements.length;
  const lowAttendanceStudents = students.filter(
    (student) => Number(student.attendance || 0) < 75,
  ).length;

  // Get last 5 exam records
  const recentMarks = (Array.isArray(exams) ? exams : []).slice(0, 5);

  // Get recent announcements
  const myAnnouncements = (
    Array.isArray(announcements) ? announcements : []
  ).slice(0, 3);

  // Calculate class performance
  const subjectPerformance = Object.values(
    exams.reduce((summary, exam) => {
      const subject = exam.subject || "Unknown subject";
      const entry = summary[subject] || { subject, marks: 0, total: 0 };
      entry.marks += Number(exam.marks || 0);
      entry.total += Number(exam.total || 0);
      summary[subject] = entry;
      return summary;
    }, {}),
  ).map((entry) => ({
    subject: entry.subject,
    avgMarks: entry.total ? Math.round((entry.marks / entry.total) * 100) : 0,
  }));

  const attendanceOverview = attendance.slice(-7).map((record) => ({
    day: record.date || "—",
    present: record.status === "present" ? 1 : 0,
    absent: record.status === "absent" ? 1 : 0,
    date: record.date || "—",
  }));

  const rankedStudents = students
    .filter((student) => Number.isFinite(Number(student.gpa)))
    .sort((first, second) => Number(second.gpa) - Number(first.gpa));
  const topStudents = rankedStudents.slice(0, 3);
  const bottomStudents = rankedStudents.slice(-3).reverse();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <TeacherSidebar />
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* 1. Welcome Section */}
          <div className="mb-8 rounded-2xl bg-gradient-to-r from-primary-600 to-primary-700 text-white p-8 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  {getGreeting()}, {user.name}! 👋
                </h1>
                <p className="text-primary-100 text-lg">
                  {user.subject || "Subject"} · {user.batch || "Morning"} Batch
                </p>
                <p className="text-primary-200 mt-2">{getNepaliDate()}</p>
              </div>
              <div className="text-6xl">
                {getGreeting() === "Good Morning"
                  ? "🌅"
                  : getGreeting() === "Good Afternoon"
                    ? "☀️"
                    : "🌙"}
              </div>
            </div>
          </div>

          {/* 2. Quick Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-6 border border-blue-200 shadow-md hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Students</p>
                  <p className="text-3xl font-bold text-blue-900 mt-2">
                    {totalStudents}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Total students</p>
                </div>
                <div className="text-4xl">👥</div>
              </div>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-green-50 to-green-100 p-6 border border-green-200 shadow-md hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    ✅ Today's Attendance
                  </p>
                  <p className="text-3xl font-bold text-green-900 mt-2">
                    {presentToday}/{totalStudents}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Attendance taken</p>
                </div>
                <div className="text-4xl">✅</div>
              </div>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 p-6 border border-purple-200 shadow-md hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    🏆 Class Avg GPA
                  </p>
                  <p className="text-3xl font-bold text-purple-900 mt-2">
                    {classAvgGpa}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Loaded exam records
                  </p>
                </div>
                <div className="text-4xl">🏆</div>
              </div>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 p-6 border border-orange-200 shadow-md hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    📢 Announcements
                  </p>
                  <p className="text-3xl font-bold text-orange-900 mt-2">
                    {announcementsThisMonth}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Posted this month
                  </p>
                </div>
                <div className="text-4xl">📢</div>
              </div>
            </div>
          </div>

          {/* 3. Quick Action Buttons */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              ⚡ Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button
                onClick={() => navigate("/teacher/attendance")}
                className="p-6 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-lg hover:shadow-lg transition transform hover:scale-105"
              >
                <div className="text-4xl mb-2">📱</div>
                Take Attendance
              </button>
              <button
                onClick={() => navigate("/teacher/attendance")}
                className="p-6 rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white font-bold text-lg hover:shadow-lg transition transform hover:scale-105"
              >
                <div className="text-4xl mb-2">✅</div>
                Manual Attendance
              </button>
              <button
                onClick={() => navigate("/teacher/exams")}
                className="p-6 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white font-bold text-lg hover:shadow-lg transition transform hover:scale-105"
              >
                <div className="text-4xl mb-2">📝</div>
                Enter Marks
              </button>
              <button
                onClick={() => navigate("/teacher/announcements")}
                className="p-6 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white font-bold text-lg hover:shadow-lg transition transform hover:scale-105"
              >
                <div className="text-4xl mb-2">📢</div>
                Post Notice
              </button>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* 4. Today's Class Overview */}
              <div className="rounded-xl bg-white p-6 shadow-md border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  📅 Today's Class Overview
                </h3>
                <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-6 rounded-lg border border-gray-200">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-sm text-gray-600">Date & Time</p>
                      <p className="text-lg font-bold text-gray-900 mt-1">
                        6:00 - 8:00 AM
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Batch</p>
                      <p className="text-lg font-bold text-gray-900 mt-1">
                        {user.batch || "Morning"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Subject</p>
                      <p className="text-lg font-bold text-gray-900 mt-1">
                        {user.subject || "Math"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Students Expected</p>
                      <p className="text-lg font-bold text-gray-900 mt-1">
                        {totalStudents}
                      </p>
                    </div>
                  </div>

                  {/* Attendance Status Alert */}
                  {!latestAttendance.length ? (
                    <div className="mt-6 p-4 bg-red-50 border-2 border-red-300 rounded-lg flex items-center justify-between">
                      <div>
                        <p className="text-red-900 font-bold">
                          ⚠️ Attendance Not Taken Yet
                        </p>
                        <p className="text-sm text-red-700 mt-1">
                          Please mark attendance for today's class
                        </p>
                      </div>
                      <button
                        onClick={() => navigate("/teacher/attendance")}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition"
                      >
                        Take Now
                      </button>
                    </div>
                  ) : (
                    <div className="mt-6 p-4 bg-green-50 border-2 border-green-300 rounded-lg flex items-center justify-between">
                      <div>
                        <p className="text-green-900 font-bold">
                          ✅ Attendance Taken
                        </p>
                        <p className="text-sm text-green-700 mt-1">
                          All students marked for today
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 5. Attendance Overview Chart */}
              <div className="rounded-xl bg-white p-6 shadow-md border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  📈 Attendance Overview (Last 14 Days)
                </h3>
                <div className="space-y-3">
                  {attendanceOverview.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <span className="w-12 font-bold text-gray-700">
                        {item.day}
                      </span>
                      <div className="flex-1">
                        <div className="flex gap-1">
                          {Array.from({ length: item.present }).map((_, i) => (
                            <div
                              key={`p-${i}`}
                              className="h-6 bg-green-400 rounded-sm"
                              style={{ width: `${item.present ? 100 : 0}%` }}
                            ></div>
                          ))}
                          {Array.from({ length: item.absent }).map((_, i) => (
                            <div
                              key={`a-${i}`}
                              className="h-6 bg-red-400 rounded-sm"
                              style={{ width: `${item.absent ? 100 : 0}%` }}
                            ></div>
                          ))}
                        </div>
                      </div>
                      <span className="text-sm font-medium text-gray-600 w-16">
                        {item.present ? "Present" : "Absent"}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <p>
                    Monthly Attendance:{" "}
                    <span className="font-bold text-gray-900">
                      {totalStudents
                        ? ((presentToday / totalStudents) * 100).toFixed(0)
                        : 0}
                      %
                    </span>
                  </p>
                </div>
              </div>

              {/* 6. Class Performance Overview */}
              <div className="rounded-xl bg-white p-6 shadow-md border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  🏆 Class Performance Overview
                </h3>
                <div className="space-y-4 mb-6">
                  {subjectPerformance.map((item) => (
                    <div key={item.subject}>
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-gray-700">
                          {item.subject}
                        </p>
                        <p className="font-bold text-gray-900">
                          {item.avgMarks}%
                        </p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary-400 to-primary-600"
                          style={{ width: `${item.avgMarks}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Top and Bottom Students */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-sm font-bold text-green-900 mb-3">
                      🌟 Top 3 Students
                    </p>
                    <div className="space-y-2">
                      {topStudents.length ? (
                        topStudents.map((student, index) => (
                          <p
                            key={student.id || student.name}
                            className="text-sm text-gray-700"
                          >
                            {index + 1}. {student.name} - {student.gpa} GPA
                          </p>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">
                          No GPA records available.
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <p className="text-sm font-bold text-red-900 mb-3">
                      ⚠️ Bottom 3 Students
                    </p>
                    <div className="space-y-2">
                      {bottomStudents.length ? (
                        bottomStudents.map((student, index) => (
                          <p
                            key={student.id || student.name}
                            className="text-sm text-gray-700"
                          >
                            {index + 1}. {student.name} - {student.gpa} GPA
                          </p>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">
                          No GPA records available.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* 7. Students List */}
              <div className="rounded-xl bg-white p-6 shadow-md border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    👥 Students
                  </h3>
                  <button
                    onClick={() => navigate("/teacher/students")}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    View All →
                  </button>
                </div>
                <div className="space-y-3">
                  {students.slice(0, 4).map((student) => (
                    <div
                      key={student.id || student.name}
                      className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            {student.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            Class {student.class}
                          </p>
                        </div>
                        <div className="text-right">
                          <p
                            className={`text-xs font-bold ${
                              student.attendance >= 75
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {student.attendance ?? "—"}%
                          </p>
                          <p className="text-xs text-gray-500">
                            {student.gpa ?? "—"} GPA
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 11. Alerts & Reminders */}
              <div className="rounded-xl bg-white p-6 shadow-md border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  ⚠️ Alerts & Reminders
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-red-50 border-l-4 border-red-600 rounded">
                    <p className="text-sm font-bold text-red-900">
                      🔴 Attendance not taken today
                    </p>
                    <p className="text-xs text-red-700 mt-1">
                      Mark attendance for your class
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-50 border-l-4 border-yellow-600 rounded">
                    <p className="text-sm font-bold text-yellow-900">
                      🟡 {lowAttendanceStudents} students below 75%
                    </p>
                    <p className="text-xs text-yellow-700 mt-1">
                      View list and take action
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-50 border-l-4 border-yellow-600 rounded">
                    <p className="text-sm font-bold text-yellow-900">
                      🟡 Weekly test not entered this week
                    </p>
                    <p className="text-xs text-yellow-700 mt-1">
                      Enter marks for recent exams
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 border-l-4 border-gray-400 rounded">
                    <p className="text-sm font-bold text-green-900">
                      ℹ️ Fee data is managed by administrators
                    </p>
                    <p className="text-xs text-green-700 mt-1">
                      Teacher dashboard does not include fee statistics
                    </p>
                  </div>
                </div>
              </div>

              {/* 12. Student Attendance Status */}
              <div className="rounded-xl bg-white p-6 shadow-md border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  📊 Today's Attendance Status
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-700">
                        Present
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        {presentToday} students
                      </p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="h-full bg-green-500"
                        style={{
                          width: `${(presentToday / totalStudents) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-700">
                        Absent
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        {absentToday} students
                      </p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="h-full bg-red-500"
                        style={{
                          width: `${(absentToday / totalStudents) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {absentToday > 0 && (
                    <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
                      <p className="text-sm font-bold text-red-900 mb-2">
                        Absent Students:
                      </p>
                      <div className="space-y-1">
                        {latestAttendance
                          .filter((record) => record.status === "absent")
                          .slice(0, 4)
                          .map((record) => (
                            <p
                              key={record.studentId}
                              className="text-xs text-red-700"
                            >
                              • {record.name || record.studentId}
                            </p>
                          ))}
                      </div>
                      <button
                        onClick={() => navigate("/teacher/announcements")}
                        className="mt-3 w-full text-sm bg-red-600 text-white py-1 rounded font-medium hover:bg-red-700 transition"
                      >
                        Send Notice
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 8. Recent Marks Entry */}
            <div className="rounded-xl bg-white p-6 shadow-md border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  📝 Recent Marks Entry
                </h3>
                <button
                  onClick={() => navigate("/teacher/exams")}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Add New →
                </button>
              </div>
              <div className="space-y-3">
                {recentMarks.length > 0 ? (
                  recentMarks.slice(0, 5).map((exam, idx) => (
                    <div
                      key={exam._id || idx}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {exam.subject || "Subject"}
                          </p>
                          <p className="text-sm text-gray-600">
                            Class {exam.class || "10"} ·{" "}
                            {typeof exam.date === "string"
                              ? new Date(exam.date).toLocaleDateString()
                              : exam.date || "Date"}
                          </p>
                          <p className="text-sm font-bold text-primary-600 mt-1">
                            {exam.marks}/{exam.total} · {exam.grade || "—"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-500">
                    <p className="text-sm">No marks entered yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* 9. My Announcements */}
            <div className="rounded-xl bg-white p-6 shadow-md border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  📢 My Announcements
                </h3>
                <button
                  onClick={() => navigate("/teacher/announcements")}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Post New →
                </button>
              </div>
              <div className="space-y-3">
                {myAnnouncements.length > 0 ? (
                  myAnnouncements.map((ann) => (
                    <div
                      key={ann._id || ann.id}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">
                            {ann.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {typeof ann.createdAt === "string"
                              ? new Date(ann.createdAt).toLocaleDateString()
                              : ann.date || "Date"}
                          </p>
                          <p className="text-xs text-primary-600 font-medium mt-1">
                            {ann.author || "Announcement"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-500">
                    <p className="text-sm">No announcements yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 10. Batch Schedule Card */}
          <div className="mt-8 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-6 shadow-lg">
            <h3 className="text-2xl font-bold mb-6">📅 My Batch Schedule</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white bg-opacity-10 backdrop-blur p-4 rounded-lg border border-white border-opacity-20">
                <p className="text-sm opacity-90 font-medium">
                  Configured batch
                </p>
                <p className="text-2xl font-bold mt-2">
                  {user.batch || "Not configured"}
                </p>
                <p className="text-sm opacity-75 mt-2">
                  Assignment data is not available
                </p>
                <p className="text-lg font-bold mt-2">
                  {totalStudents} Students
                </p>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur p-4 rounded-lg border border-white border-opacity-20">
                <p className="text-sm opacity-90 font-medium">Subject</p>
                <p className="text-2xl font-bold mt-2">
                  {user.subject || "Not configured"}
                </p>
                <p className="text-sm opacity-75 mt-2">
                  Teacher account subject
                </p>
                <p className="text-lg font-bold mt-2">
                  {exams.length} exam records
                </p>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur p-4 rounded-lg border border-white border-opacity-20">
                <p className="text-sm opacity-90 font-medium">Status</p>
                <p className="text-2xl font-bold mt-2">Authenticated</p>
                <p className="text-sm opacity-75 mt-2">
                  No schedule status stored
                </p>
                <p className="text-lg font-bold mt-2">
                  {attendance.length} attendance records
                </p>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur p-4 rounded-lg border border-white border-opacity-20">
                <p className="text-sm opacity-90 font-medium">Total Hours</p>
                <p className="text-2xl font-bold mt-2">—</p>
                <p className="text-sm opacity-75 mt-2">Hours are not stored</p>
                <p className="text-lg font-bold mt-2">No schedule data</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
