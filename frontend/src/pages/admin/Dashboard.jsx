import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "../../components/layout/Sidebar";
import { getStudents } from "../../services/studentService";
import { getTeachers } from "../../services/teacherService";
import { getBatches } from "../../services/batchService";
import { getFees } from "../../services/feeService";
import { getAnnouncements } from "../../services/announcementService";
import { getAttendanceRecords } from "../../services/attendanceService";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { jsPDF } from "jspdf";

function NepaliDate() {
  // Minimal placeholder until a proper Nepali date util is added
  const now = new Date();
  const opts = { weekday: "long", month: "long", day: "numeric" };
  return now.toLocaleDateString("ne-NP", opts);
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [batches, setBatches] = useState([]);
  const [fees, setFees] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    async function loadAll() {
      try {
        setLoading(true);
        const [s, t, b, f, a, att] = await Promise.all([
          getStudents(),
          getTeachers(),
          getBatches(),
          getFees(),
          getAnnouncements(),
          getAttendanceRecords(),
        ]);
        setStudents(s || []);
        setTeachers(t || []);
        setBatches(b || []);
        setFees(f || []);
        setAnnouncements(a || []);
        setAttendance(att || []);
      } catch (err) {
        setError("Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }

    loadAll();
  }, []);

  if (!user) return null;

  // Derived values
  const totalStudents = students.length;
  const totalTeachers = teachers.length;
  const totalBatches = batches.length;

  const feeCollected = fees.reduce((sum, it) => sum + Number(it.paid || 0), 0);
  const feeExpected = fees.reduce((sum, it) => sum + Number(it.amount || 0), 0);
  const feePending = fees.reduce(
    (sum, it) =>
      sum +
      Number(
        it.due ?? Math.max(Number(it.amount || 0) - Number(it.paid || 0), 0),
      ),
    0,
  );

  const todayAttendance = (() => {
    if (!attendance || attendance.length === 0) {
      return { percent: 0, present: 0, total: 0 };
    }
    const latestDate = attendance.reduce(
      (latest, record) => (record.date > latest ? record.date : latest),
      attendance[0].date || "",
    );
    const latestRecords = attendance.filter(
      (record) => record.date === latestDate,
    );
    const present = latestRecords.filter(
      (record) => record.status === "present",
    ).length;
    const total = latestRecords.length;
    const percent = total ? Math.round((present / total) * 100) : 0;
    return { percent, present, total };
  })();

  const recentStudents = students.slice().reverse().slice(0, 5);

  // Chart data derivations
  const monthlyFeeData = (() => {
    if (!fees || fees.length === 0) {
      return Array.from({ length: 8 }).map((_, i) => ({
        month: `M-${i + 1}`,
        amount: 0,
      }));
    }
    const map = new Map();
    fees.forEach((f) => {
      const m = f.month || f.monthName || f.collectionMonth || "This Month";
      map.set(m, (map.get(m) || 0) + Number(f.paid || 0));
    });
    return Array.from(map.entries())
      .slice(-8)
      .map(([month, amount]) => ({ month, amount }));
  })();

  const attendanceData = (() => {
    if (!attendance || attendance.length === 0) return [];
    return attendance.slice(-6).map((a, idx) => ({
      week: a.date || `Record ${idx + 1}`,
      percent: a.status === "present" ? 100 : 0,
    }));
  })();

  const feeDistribution = (() => {
    const paid = fees.filter((f) => f.status === "paid").length;
    const partial = fees.filter((f) => f.status === "partial").length;
    const due = fees.filter(
      (f) => f.status === "due" || f.status === "pending",
    ).length;
    return [
      { name: "Paid", value: paid },
      { name: "Partial", value: partial },
      { name: "Due", value: due },
    ];
  })();

  const studentsPerClass = (() => {
    const map = new Map();
    students.forEach((s) => {
      const cls = s.class || s.grade || "-";
      map.set(cls, (map.get(cls) || 0) + 1);
    });
    return Array.from(map.entries()).map(([cls, count]) => ({ cls, count }));
  })();

  const exportFeeSummaryPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Fee Summary", 14, 20);
    doc.setFontSize(10);
    const rows = [["Month", "Expected", "Collected", "Pending", "Status"]];
    rows.push([
      "All fee records",
      `Rs. ${feeExpected.toLocaleString()}`,
      `Rs. ${feeCollected.toLocaleString()}`,
      `Rs. ${feePending.toLocaleString()}`,
      `${Math.round((feeCollected / Math.max(feeExpected, 1)) * 100)}%`,
    ]);
    let y = 30;
    rows.forEach((r) => {
      doc.text(r.join("  |  "), 14, y);
      y += 8;
    });
    doc.save("fee-summary.pdf");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-2xl bg-white p-8 shadow-lg border-2 border-primary-200">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold text-primary-900">
                  Good Morning, {user.name.split(" ")[0]}!
                </h1>
                <p className="text-gray-600 mt-2">
                  TRI-NETRA Tuition Center · Administrator
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Today is {NepaliDate()}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Role</p>
                  <p className="font-semibold text-primary-900">
                    Administrator
                  </p>
                </div>
                <button
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                  className="rounded-2xl bg-red-600 text-white px-5 py-2 hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </div>
            </div>

            {loading ? (
              <div className="rounded-xl bg-gray-50 p-6 text-gray-600">
                Loading dashboard data…
              </div>
            ) : error ? (
              <div className="rounded-xl bg-red-50 p-6 text-red-700">
                {error}
              </div>
            ) : (
              <>
                {/* Top Stats */}
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mt-4">
                  <div className="md:col-span-1 rounded-xl bg-blue-50 p-4 border border-blue-200">
                    <p className="text-gray-600 text-sm">👥 Total Students</p>
                    <p className="text-2xl font-bold text-blue-900 mt-2">
                      {totalStudents}
                    </p>
                  </div>
                  <div className="md:col-span-1 rounded-xl bg-purple-50 p-4 border border-purple-200">
                    <p className="text-gray-600 text-sm">🎓 Total Teachers</p>
                    <p className="text-2xl font-bold text-purple-900 mt-2">
                      {totalTeachers}
                    </p>
                  </div>
                  <div className="md:col-span-1 rounded-xl bg-green-50 p-4 border border-green-200">
                    <p className="text-gray-600 text-sm">💳 Fee Collected</p>
                    <p className="text-2xl font-bold text-green-900 mt-2">
                      Rs. {feeCollected.toLocaleString()}
                    </p>
                  </div>
                  <div className="md:col-span-1 rounded-xl bg-red-50 p-4 border border-red-200">
                    <p className="text-gray-600 text-sm">⚠️ Fee Pending</p>
                    <p className="text-2xl font-bold text-red-900 mt-2">
                      Rs. {feePending.toLocaleString()}
                    </p>
                  </div>
                  <div className="md:col-span-1 rounded-xl bg-green-50 p-4 border border-green-200">
                    <p className="text-gray-600 text-sm">
                      ✅ Today's Attendance
                    </p>
                    <p className="text-2xl font-bold text-green-900 mt-2">
                      {todayAttendance.percent}% Present
                    </p>
                  </div>
                  <div className="md:col-span-1 rounded-xl bg-orange-50 p-4 border border-orange-200">
                    <p className="text-gray-600 text-sm">📚 Total Batches</p>
                    <p className="text-2xl font-bold text-orange-900 mt-2">
                      {totalBatches}
                    </p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-6 rounded-xl p-4 border border-gray-100 bg-gray-50">
                  <h3 className="font-semibold mb-2">⚡ Quick Actions</h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => navigate("/admin/students")}
                      className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                      ➕ Add Student
                    </button>
                    <button
                      onClick={() => navigate("/admin/teachers")}
                      className="px-4 py-2 bg-purple-600 text-white rounded"
                    >
                      ➕ Add Teacher
                    </button>
                    <button
                      onClick={() => navigate("/admin/fees")}
                      className="px-4 py-2 bg-green-600 text-white rounded"
                    >
                      💳 Record Payment
                    </button>
                    <button
                      onClick={() => navigate("/admin/announcements")}
                      className="px-4 py-2 bg-yellow-500 text-white rounded"
                    >
                      📢 Post Notice
                    </button>
                    <button
                      onClick={() => navigate("/admin/reports")}
                      className="px-4 py-2 bg-gray-700 text-white rounded"
                    >
                      📄 Generate Report
                    </button>
                    <button
                      onClick={() => navigate("/admin/fees")}
                      className="px-4 py-2 bg-indigo-600 text-white rounded"
                    >
                      📅 Generate Fees
                    </button>
                  </div>
                </div>

                {/* Charts & Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
                  <div className="lg:col-span-2 rounded-xl bg-white p-4 border">
                    <h4 className="font-semibold mb-2">📈 Charts</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="h-48 rounded-lg bg-gray-50 p-2">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={monthlyFeeData}
                            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                          >
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="amount" fill="#16a34a" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="h-48 rounded-lg bg-gray-50 p-2">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={attendanceData}
                            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                          >
                            <XAxis dataKey="week" />
                            <YAxis />
                            <Tooltip />
                            <Line
                              type="monotone"
                              dataKey="percent"
                              stroke="#2563eb"
                              strokeWidth={2}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="h-48 rounded-lg bg-gray-50 p-2 flex items-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={feeDistribution}
                              dataKey="value"
                              nameKey="name"
                              innerRadius={30}
                              outerRadius={60}
                            >
                              {feeDistribution.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={
                                    index === 0
                                      ? "#16a34a"
                                      : index === 1
                                        ? "#f59e0b"
                                        : "#ef4444"
                                  }
                                />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="h-48 rounded-lg bg-gray-50 p-2">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={studentsPerClass}
                            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                          >
                            <XAxis dataKey="cls" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#f97316" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl bg-white p-4 border">
                    <h4 className="font-semibold mb-2">📅 Today's Overview</h4>
                    <div className="text-sm text-gray-700">
                      <p className="mb-2">Today — {NepaliDate()}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Latest attendance records</span>
                          <span className="text-green-600">
                            {todayAttendance.total
                              ? "✅ Available"
                              : "— No records"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Present records</span>
                          <span className="text-green-600">
                            {todayAttendance.present}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Absent records</span>
                          <span className="text-gray-600">
                            {Math.max(
                              todayAttendance.total - todayAttendance.present,
                              0,
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 border-t pt-3">
                        <p>
                          Total Present Today:{" "}
                          <strong>
                            {todayAttendance.present} / {todayAttendance.total}
                          </strong>
                        </p>
                        <p>
                          Total Absent Today:{" "}
                          <strong>
                            {Math.max(
                              todayAttendance.total - todayAttendance.present,
                              0,
                            )}{" "}
                            / {todayAttendance.total}
                          </strong>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Alerts & Fee Summary */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
                  <div className="rounded-xl bg-white p-4 border">
                    <h4 className="font-semibold mb-2">
                      ⚠️ Alerts & Notifications
                    </h4>
                    <ul className="text-sm space-y-2">
                      <li className="text-red-600">
                        🔴{" "}
                        {
                          fees.filter(
                            (x) => x.status === "due" || x.status === "pending",
                          ).length
                        }{" "}
                        students have pending fees this month — View list
                      </li>
                      <li className="text-red-600">
                        🔴 Latest attendance records: {todayAttendance.total}
                      </li>
                      <li className="text-yellow-600">
                        🟡{" "}
                        {
                          students.filter((s) => Number(s.attendance || 0) < 75)
                            .length
                        }{" "}
                        students below 75% attendance — Take action
                      </li>
                      <li className="text-yellow-600">
                        🟡{" "}
                        {
                          students.filter(
                            (student) =>
                              !fees.some(
                                (fee) =>
                                  String(fee.student) === String(student.id),
                              ),
                          ).length
                        }{" "}
                        students have no fee record — Generate now
                      </li>
                      <li className="text-green-600">
                        🟢 {teachers.length} teacher records loaded
                      </li>
                    </ul>
                  </div>

                  <div className="lg:col-span-2 rounded-xl bg-white p-4 border">
                    <h4 className="font-semibold mb-2">
                      💳 Fee Summary (This Month)
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="text-left text-gray-600">
                          <tr>
                            <th className="py-2">Month</th>
                            <th className="py-2">Expected</th>
                            <th className="py-2">Collected</th>
                            <th className="py-2">Pending</th>
                            <th className="py-2">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-t">
                            <td className="py-2">All records</td>
                            <td className="py-2">
                              Rs. {feeExpected.toLocaleString()}
                            </td>
                            <td className="py-2">
                              Rs. {feeCollected.toLocaleString()}
                            </td>
                            <td className="py-2">
                              Rs. {feePending.toLocaleString()}
                            </td>
                            <td className="py-2">
                              {feeExpected
                                ? Math.round((feeCollected / feeExpected) * 100)
                                : 0}
                              %
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <div className="mt-3 flex justify-end">
                        <button
                          onClick={exportFeeSummaryPdf}
                          className="px-3 py-1 bg-gray-800 text-white rounded"
                        >
                          Export as PDF
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Students & Teachers */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
                  <div className="rounded-xl bg-white p-4 border">
                    <h4 className="font-semibold mb-2">👥 Recent Students</h4>
                    <ul className="divide-y">
                      {recentStudents.map((s, idx) => (
                        <li
                          key={s.id || idx}
                          className="py-2 flex justify-between items-center"
                        >
                          <div>
                            <div className="font-medium">
                              {s.name || s.fullName || "Unnamed"}
                            </div>
                            <div className="text-sm text-gray-500">
                              Class {s.class || s.grade || "-"} ·{" "}
                              {s.batch || "-"}
                            </div>
                          </div>
                          <div className="text-sm text-right">
                            <div>
                              {s.feeStatus === "paid"
                                ? "✅ Paid"
                                : s.feeStatus === "partial"
                                  ? "🟡 Partial"
                                  : "🔴 Due"}
                            </div>
                            <div className="text-gray-500">
                              {s.attendance ?? "--"}%
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 text-right">
                      <button
                        onClick={() => navigate("/admin/students")}
                        className="px-3 py-1 bg-blue-600 text-white rounded"
                      >
                        View all students
                      </button>
                    </div>
                  </div>

                  <div className="rounded-xl bg-white p-4 border">
                    <h4 className="font-semibold mb-2">🎓 Teacher Overview</h4>
                    <ul className="divide-y">
                      {teachers.map((t, i) => (
                        <li
                          key={t.id || i}
                          className="py-2 flex justify-between items-center"
                        >
                          <div>
                            <div className="font-medium">
                              {t.name || t.fullName || "Unnamed"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {t.subject || "-"} · {t.batch || "-"}
                            </div>
                          </div>
                          <div className="text-sm text-right">
                            {t.batch || "Batch not configured"}
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 text-right">
                      <button
                        onClick={() => navigate("/admin/teachers")}
                        className="px-3 py-1 bg-blue-600 text-white rounded"
                      >
                        View all teachers
                      </button>
                    </div>
                  </div>
                </div>

                {/* Announcements & Quick Reports */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
                  <div className="lg:col-span-2 rounded-xl bg-white p-4 border">
                    <h4 className="font-semibold mb-2">
                      📢 Recent Announcements
                    </h4>
                    <ul className="divide-y">
                      {announcements.slice(0, 4).map((n, i) => (
                        <li
                          key={n.id || i}
                          className="py-2 flex justify-between"
                        >
                          <div>
                            <div className="font-medium">{n.title}</div>
                            <div className="text-sm text-gray-500">
                              {n.author || "Admin"} · {n.date || ""}
                            </div>
                          </div>
                          <div className="flex gap-2"></div>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 text-right">
                      <button
                        onClick={() => navigate("/admin/announcements")}
                        className="px-3 py-1 bg-yellow-500 text-white rounded"
                      >
                        Post new announcement
                      </button>
                    </div>
                  </div>

                  <div className="rounded-xl bg-white p-4 border">
                    <h4 className="font-semibold mb-2">📄 Quick Reports</h4>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => navigate("/admin/students")}
                        className="px-3 py-2 bg-gray-800 text-white rounded text-left"
                      >
                        Student List · View
                      </button>
                      <button
                        onClick={() => navigate("/admin/attendance")}
                        className="px-3 py-2 bg-gray-800 text-white rounded text-left"
                      >
                        This Month Attendance · View
                      </button>
                      <button
                        onClick={() => navigate("/admin/fees")}
                        className="px-3 py-2 bg-gray-800 text-white rounded text-left"
                      >
                        This Month Fee Report · View
                      </button>
                      <button
                        onClick={() => navigate("/admin/exams")}
                        className="px-3 py-2 bg-gray-800 text-white rounded text-left"
                      >
                        Exam Results · View
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
