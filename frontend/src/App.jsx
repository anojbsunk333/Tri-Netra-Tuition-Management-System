import { useState, useEffect, useRef } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Users,
  BookOpen,
  DollarSign,
  ClipboardList,
  Bell,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Award,
  TrendingUp,
  Calendar,
  QrCode,
  FileText,
  Settings,
  Home,
  UserCheck,
  GraduationCap,
  CreditCard,
  Megaphone,
  BarChart2,
  Download,
  Eye,
  Plus,
  Edit,
  Trash2,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  ChevronDown,
  Star,
  Phone,
  Mail,
  MapPin,
  Shield,
  Printer,
} from "lucide-react";

import {
  R,
  DARK,
  USERS,
  STUDENTS,
  TEACHERS,
  BATCHES,
  FEES,
  EXAMS,
  ANNOUNCEMENTS,
  monthlyIncome,
  attendanceTrend,
  feeDistrib,
  getGrade,
} from "../../backend/mockData";

// ─── STATUS BADGE ──────────────────────────────────────────────────────────────
function Badge({ status }) {
  const styles = {
    paid: "bg-green-100 text-green-700 border border-green-200",
    due: "bg-red-100 text-red-700 border border-red-200",
    partial: "bg-amber-100 text-amber-700 border border-amber-200",
    present: "bg-green-100 text-green-700 border border-green-200",
    absent: "bg-red-100 text-red-700 border border-red-200",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${styles[status] || "bg-gray-100 text-gray-600"}`}
    >
      {status}
    </span>
  );
}

// ─── STAT CARD ─────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color = R }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4 shadow-sm">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: color + "15" }}
      >
        <Icon size={22} style={{ color }} />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ─── SECTION HEADER ────────────────────────────────────────────────────────────
function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// ─── MODAL WRAPPER ─────────────────────────────────────────────────────────────
function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 text-lg">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500"
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

// ─── QR CODE (SVG-based simple display) ────────────────────────────────────────
function QrPlaceholder({ value, size = 120 }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="border-2 border-gray-900 rounded-lg p-2"
        style={{ width: size + 16, height: size + 16 }}
      >
        <svg width={size} height={size} viewBox="0 0 100 100">
          {[0, 1, 2, 3, 4, 5, 6].map((r) =>
            [0, 1, 2, 3, 4, 5, 6].map((c) => {
              const val = (r * 7 + c + value.charCodeAt(r % value.length)) % 3;
              return val > 0 ? (
                <rect
                  key={`${r}-${c}`}
                  x={c * 14}
                  y={r * 14}
                  width={13}
                  height={13}
                  fill="#111"
                />
              ) : null;
            }),
          )}
          <rect
            x={0}
            y={0}
            width={28}
            height={28}
            fill="none"
            stroke="#111"
            strokeWidth={4}
          />
          <rect
            x={72}
            y={0}
            width={28}
            height={28}
            fill="none"
            stroke="#111"
            strokeWidth={4}
          />
          <rect
            x={0}
            y={72}
            width={28}
            height={28}
            fill="none"
            stroke="#111"
            strokeWidth={4}
          />
          <rect x={8} y={8} width={12} height={12} fill="#111" />
          <rect x={80} y={8} width={12} height={12} fill="#111" />
          <rect x={8} y={80} width={12} height={12} fill="#111" />
        </svg>
      </div>
      <p className="text-xs text-gray-400 font-mono">{value}</p>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// LANDING PAGE
// ──────────────────────────────────────────────────────────────────────────────
function LandingPage({ onLogin }) {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* NAVBAR */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full border-2 flex items-center justify-center"
              style={{ borderColor: R }}
            >
              <span className="font-black text-sm" style={{ color: R }}>
                TN
              </span>
            </div>
            <div>
              <p className="font-black text-gray-900 text-sm leading-none">
                TRI·NETRA
              </p>
              <p className="text-xs text-gray-500 leading-none">
                Tuition Center
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <a href="#courses" className="hover:text-gray-900">
              Courses
            </a>
            <a href="#about" className="hover:text-gray-900">
              About
            </a>
            <a href="#contact" className="hover:text-gray-900">
              Contact
            </a>
          </div>
          <button
            onClick={onLogin}
            className="px-5 py-2 rounded-lg text-white text-sm font-semibold"
            style={{ background: R }}
          >
            Login Portal
          </button>
        </div>
      </nav>

      {/* HERO */}
      <div
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${DARK} 0%, #1f2937 100%)`,
        }}
      >
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 200 + 50,
                height: Math.random() * 200 + 50,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                border: `1px solid ${R}`,
                opacity: 0.3,
              }}
            />
          ))}
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 mb-6">
            <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            <span className="text-red-300 text-sm font-medium">
              Admissions Open – 2082
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight">
            TRI<span style={{ color: R }}>·</span>NETRA
            <br />
            <span className="text-3xl md:text-4xl font-bold text-gray-300">
              Tuition Center
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto mb-8">
            Excellence in education for Classes 3–12. Smart learning, digital
            management, and personalized guidance.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onLogin}
              className="px-8 py-3 rounded-xl text-white font-bold text-base transition-transform hover:scale-105"
              style={{ background: R }}
            >
              Access Portal →
            </button>
            <a
              href="#courses"
              className="px-8 py-3 rounded-xl border border-white/20 text-white font-semibold text-base hover:bg-white/5"
            >
              View Courses
            </a>
          </div>
          <div className="mt-12 grid grid-cols-3 gap-6 max-w-sm mx-auto">
            {[
              ["105+", "Students"],
              ["4", "Teachers"],
              ["3", "Batches"],
            ].map(([v, l]) => (
              <div key={l} className="text-center">
                <p className="text-3xl font-black" style={{ color: R }}>
                  {v}
                </p>
                <p className="text-gray-400 text-sm">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* COURSES */}
      <div id="courses" className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-gray-900">Classes Offered</h2>
          <p className="text-gray-500 mt-2">
            Comprehensive curriculum for Class 3 to 12
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((cls) => (
            <div
              key={cls}
              className="bg-white border border-gray-100 rounded-xl p-4 text-center hover:border-red-200 hover:shadow-md transition-all cursor-pointer group"
            >
              <p className="text-2xl font-black text-gray-900 group-hover:text-red-600">
                Class {cls}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {cls <= 5 ? "Primary" : cls <= 8 ? "Middle" : "Secondary"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <div className="bg-white border-y border-gray-100 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-10">
            Why TRI-NETRA?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: QrCode,
                title: "QR Attendance",
                desc: "Smart QR-based attendance system for instant, accurate tracking.",
              },
              {
                icon: Award,
                title: "GPA System",
                desc: "Nepal-standard grading with A+ to E grades and GPA calculation.",
              },
              {
                icon: CreditCard,
                title: "Easy Fee Payment",
                desc: "Monthly & installment fee tracking with digital receipts.",
              },
              {
                icon: BarChart2,
                title: "Performance Reports",
                desc: "Detailed student analytics with PDF export capability.",
              },
              {
                icon: Bell,
                title: "Announcements",
                desc: "Instant notices from admin & teachers to all students.",
              },
              {
                icon: Shield,
                title: "Secure Portal",
                desc: "Role-based access for admin, teachers, and students.",
              },
            ].map(({ icon: I, title, desc }) => (
              <div key={title} className="flex gap-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: R + "15" }}
                >
                  <I size={18} style={{ color: R }} />
                </div>
                <div>
                  <p className="font-bold text-gray-900">{title}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CONTACT */}
      <div id="contact" className="max-w-6xl mx-auto px-6 py-16">
        <div className="bg-gray-900 rounded-2xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl font-black mb-4">Contact Us</h2>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center gap-3">
                <Phone size={16} style={{ color: R }} />
                <span>9840456962 / 9761498436</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} style={{ color: R }} />
                <span>www.trinetratuitioncenter.com</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={16} style={{ color: R }} />
                <span>Godawari-3, Taukhel, Lalitpur</span>
              </div>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-2">ESTB.</p>
            <p className="text-5xl font-black" style={{ color: R }}>
              2082
            </p>
            <p className="text-gray-400 mt-1 text-sm">B.S.</p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-gray-100 py-6 text-center text-sm text-gray-400">
        © 2082 TRI-NETRA Tuition Center. Godawari-3, Taukhel, Lalitpur.
      </footer>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// LOGIN PAGE
// ──────────────────────────────────────────────────────────────────────────────
function LoginPage({ onLogin, onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = () => {
    setLoading(true);
    setError("");
    setTimeout(() => {
      const user = USERS.find(
        (u) => u.email === email && u.password === password,
      );
      if (user) onLogin(user);
      else {
        setError("Invalid email or password. Try demo credentials below.");
        setLoading(false);
      }
    }, 600);
  };

  const demos = [
    {
      label: "Admin",
      email: "admin@trinetra.edu.np",
      pwd: "local-demo-admin-only",
      color: "#7c3aed",
    },
    {
      label: "Teacher",
      email: "ramesh@trinetra.edu.np",
      pwd: "local-demo-teacher-only",
      color: "#0891b2",
    },
    {
      label: "Student",
      email: "sita@trinetra.edu.np",
      pwd: "local-demo-student-only",
      color: "#16a34a",
    },
  ];

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: `linear-gradient(135deg, ${DARK} 0%, #374151 100%)`,
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 mx-4">
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-full border-3 flex items-center justify-center mx-auto mb-4"
            style={{ borderColor: R, border: `3px solid ${R}` }}
          >
            <span className="font-black text-xl" style={{ color: R }}>
              TN
            </span>
          </div>
          <h1 className="text-2xl font-black text-gray-900">
            TRI<span style={{ color: R }}>·</span>NETRA
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Tuition Management Portal
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Email Address
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="your@email.com"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400"
              onKeyDown={(e) => e.key === "Enter" && handle()}
            />
          </div>
          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3">
              {error}
            </p>
          )}
          <button
            onClick={handle}
            disabled={loading}
            className="w-full py-3 rounded-lg text-white font-bold text-sm transition-all"
            style={{ background: R }}
          >
            {loading ? "Signing in…" : "Sign In →"}
          </button>
        </div>

        <div className="mt-6">
          <p className="text-xs text-gray-400 text-center mb-3">
            Demo Credentials
          </p>
          <div className="grid grid-cols-3 gap-2">
            {demos.map((d) => (
              <button
                key={d.label}
                onClick={() => {
                  setEmail(d.email);
                  setPassword(d.pwd);
                }}
                className="text-xs py-2 rounded-lg border font-semibold transition-all hover:scale-105"
                style={{
                  borderColor: d.color + "40",
                  color: d.color,
                  background: d.color + "08",
                }}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onBack}
          className="w-full text-center text-sm text-gray-400 hover:text-gray-600 mt-6"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// SIDEBAR
// ──────────────────────────────────────────────────────────────────────────────
function Sidebar({ role, page, setPage, user, onLogout, open, setOpen }) {
  const adminLinks = [
    { key: "dashboard", label: "Dashboard", icon: Home },
    { key: "students", label: "Students", icon: Users },
    { key: "teachers", label: "Teachers", icon: GraduationCap },
    { key: "batches", label: "Batches", icon: BookOpen },
    { key: "attendance", label: "Attendance", icon: UserCheck },
    { key: "fees", label: "Fee Management", icon: CreditCard },
    { key: "exams", label: "Exams & Results", icon: Award },
    { key: "announcements", label: "Announcements", icon: Bell },
    { key: "reports", label: "Reports", icon: FileText },
  ];
  const teacherLinks = [
    { key: "dashboard", label: "Dashboard", icon: Home },
    { key: "attendance", label: "Take Attendance", icon: UserCheck },
    { key: "exams", label: "Enter Results", icon: Award },
    { key: "announcements", label: "Announcements", icon: Bell },
  ];
  const studentLinks = [
    { key: "dashboard", label: "My Dashboard", icon: Home },
    { key: "profile", label: "ID Card", icon: Shield },
    { key: "attendance", label: "My Attendance", icon: UserCheck },
    { key: "fees", label: "Fee Status", icon: CreditCard },
    { key: "exams", label: "My Results", icon: Award },
    { key: "announcements", label: "Notices", icon: Bell },
  ];
  const links =
    role === "admin"
      ? adminLinks
      : role === "teacher"
        ? teacherLinks
        : studentLinks;

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        className={`fixed top-0 left-0 h-full z-40 transition-transform duration-300 flex flex-col w-64 ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:z-auto`}
        style={{ background: DARK }}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full border-2 flex items-center justify-center"
              style={{ borderColor: R }}
            >
              <span className="font-black text-xs" style={{ color: R }}>
                TN
              </span>
            </div>
            <div>
              <p className="font-black text-white text-sm">TRI·NETRA</p>
              <p className="text-xs text-gray-400">Tuition Center</p>
            </div>
          </div>
        </div>

        {/* User info */}
        <div className="px-4 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{ background: R }}
            >
              {user.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold truncate">
                {user.name}
              </p>
              <p className="text-gray-400 text-xs capitalize">{user.role}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {links.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => {
                setPage(key);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${page === key ? "text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
              style={page === key ? { background: R } : {}}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-5">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// ADMIN VIEWS
// ──────────────────────────────────────────────────────────────────────────────
function AdminDashboard() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Admin Dashboard"
        subtitle="Overview of TRI-NETRA Tuition Center"
      />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Total Students"
          value="105"
          sub="+8 this month"
          color="#7c3aed"
        />
        <StatCard
          icon={GraduationCap}
          label="Teachers"
          value="4"
          sub="All active"
          color="#0891b2"
        />
        <StatCard
          icon={CreditCard}
          label="Fee Collected"
          value="₹2.15L"
          sub="Baisakh 2082"
          color="#16a34a"
        />
        <StatCard
          icon={UserCheck}
          label="Avg Attendance"
          value="88%"
          sub="This week"
          color={R}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">
            Monthly Fee Collection
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyIncome}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(v) => [`Rs. ${v.toLocaleString()}`, "Amount"]}
              />
              <Bar dataKey="amount" fill={R} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">
            Attendance Trend (Weekly)
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={attendanceTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => [`${v}%`, "Present"]} />
              <Line
                type="monotone"
                dataKey="present"
                stroke={R}
                strokeWidth={2}
                dot={{ fill: R, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Fee Distribution</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={feeDistrib}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                dataKey="value"
              >
                {feeDistrib.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [`${v}%`, ""]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex gap-3 justify-center">
            {feeDistrib.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: d.color }}
                />
                <span className="text-xs text-gray-600">
                  {d.name} {d.value}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Recent Announcements</h3>
          <div className="space-y-3">
            {ANNOUNCEMENTS.slice(0, 3).map((a) => (
              <div key={a.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                <Bell
                  size={16}
                  className="text-gray-400 mt-0.5 flex-shrink-0"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {a.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {a.author} · {a.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StudentsPage() {
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);

  const filtered = STUDENTS.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.class.includes(search) ||
      s.id.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <SectionHeader
        title="Students"
        subtitle={`${STUDENTS.length} registered students`}
        action={
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-semibold"
            style={{ background: R }}
            onClick={() => setModal("add")}
          >
            <Plus size={14} />
            Add Student
          </button>
        }
      />
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-50">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, class, ID…"
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                {[
                  "ID",
                  "Name",
                  "Class",
                  "Batch",
                  "Phone",
                  "Attendance",
                  "Fee",
                  "GPA",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">
                    {s.id}
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-900">
                    {s.name}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{s.class}</td>
                  <td className="px-4 py-3 text-gray-600">{s.batch}</td>
                  <td className="px-4 py-3 text-gray-600">{s.phone}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${s.attendance}%`,
                            background:
                              s.attendance >= 85
                                ? "#16a34a"
                                : s.attendance >= 70
                                  ? "#f59e0b"
                                  : R,
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-600">
                        {s.attendance}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge status={s.feeStatus} />
                  </td>
                  <td
                    className="px-4 py-3 font-semibold"
                    style={{
                      color:
                        s.gpa >= 3.5 ? "#16a34a" : s.gpa >= 2.5 ? "#f59e0b" : R,
                    }}
                  >
                    {s.gpa}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setSelected(s);
                          setModal("view");
                        }}
                        className="p-1.5 rounded hover:bg-blue-50 text-blue-500"
                      >
                        <Eye size={14} />
                      </button>
                      <button className="p-1.5 rounded hover:bg-amber-50 text-amber-500">
                        <Edit size={14} />
                      </button>
                      <button className="p-1.5 rounded hover:bg-red-50 text-red-500">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={modal === "view" && !!selected}
        onClose={() => setModal(null)}
        title="Student Details"
      >
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-black"
                style={{ background: R }}
              >
                {selected.name.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-gray-900 text-lg">
                  {selected.name}
                </p>
                <p className="text-gray-500 text-sm">
                  Class {selected.class} · {selected.batch} Batch ·{" "}
                  {selected.id}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ["Phone", selected.phone],
                ["Parent", selected.parent],
                ["Joined", selected.joined],
                ["Attendance", selected.attendance + "%"],
                ["GPA", selected.gpa],
                ["Fee Status", selected.feeStatus],
              ].map(([k, v]) => (
                <div key={k} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-500 text-xs">{k}</p>
                  <p className="font-semibold text-gray-900 mt-0.5 capitalize">
                    {v}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex justify-center pt-2">
              <QrPlaceholder value={selected.id} size={100} />
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={modal === "add"}
        onClose={() => setModal(null)}
        title="Add New Student"
      >
        <div className="space-y-3">
          {["Full Name", "Phone", "Parent Name", "Class", "Batch"].map((f) => (
            <div key={f}>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                {f}
              </label>
              <input
                placeholder={`Enter ${f}`}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20"
              />
            </div>
          ))}
          <button
            className="w-full py-2.5 rounded-lg text-white font-semibold text-sm mt-2"
            style={{ background: R }}
          >
            Add Student
          </button>
        </div>
      </Modal>
    </div>
  );
}

function TeachersPage() {
  return (
    <div>
      <SectionHeader
        title="Teachers"
        subtitle={`${TEACHERS.length} active teachers`}
        action={
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-semibold"
            style={{ background: R }}
          >
            <Plus size={14} />
            Add Teacher
          </button>
        }
      />
      <div className="grid md:grid-cols-2 gap-4">
        {TEACHERS.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold"
                style={{ background: "#0891b2" }}
              >
                {t.name.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-gray-900">{t.name}</p>
                <p className="text-sm text-gray-500">
                  {t.subject} · {t.batch} Batch
                </p>
              </div>
              <span className="ml-auto text-xs font-mono text-gray-400">
                {t.id}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-gray-50 rounded-lg p-2">
                <span className="text-gray-500">Phone</span>
                <p className="font-semibold text-gray-800 mt-0.5">{t.phone}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2">
                <span className="text-gray-500">Classes</span>
                <p className="font-semibold text-gray-800 mt-0.5">
                  Class {t.classes.join(", ")}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2 col-span-2">
                <span className="text-gray-500">Email</span>
                <p className="font-semibold text-gray-800 mt-0.5">{t.email}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BatchesPage() {
  return (
    <div>
      <SectionHeader title="Batches" subtitle="3 active batch schedules" />
      <div className="grid md:grid-cols-3 gap-4">
        {BATCHES.map((b) => (
          <div
            key={b.id}
            className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
              style={{ background: R + "15" }}
            >
              <Clock size={18} style={{ color: R }} />
            </div>
            <h3 className="text-xl font-black text-gray-900">{b.name}</h3>
            <p className="text-gray-500 text-sm mt-1">{b.time}</p>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Students</span>
                <span className="font-bold text-gray-900">{b.students}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Teacher</span>
                <span className="font-semibold text-gray-800">{b.teacher}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Classes</span>
                <span className="font-semibold text-gray-800">
                  Class {b.classes.join(", ")}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AttendancePage({ role }) {
  const [mode, setMode] = useState("manual");
  const [qrGenerated, setQrGenerated] = useState(false);
  const [attendance, setAttendance] = useState(
    STUDENTS.slice(0, 5).map((s) => ({ ...s, status: "present" })),
  );

  const toggle = (id) =>
    setAttendance((att) =>
      att.map((s) =>
        s.id === id
          ? { ...s, status: s.status === "present" ? "absent" : "present" }
          : s,
      ),
    );

  return (
    <div>
      <SectionHeader
        title={role === "student" ? "My Attendance" : "Attendance"}
        subtitle={
          role === "student"
            ? "Your attendance record"
            : "Take or view attendance"
        }
      />

      {role === "student" ? (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <StatCard
              icon={CheckCircle}
              label="Present Days"
              value="84"
              color="#16a34a"
            />
            <StatCard icon={XCircle} label="Absent Days" value="8" color={R} />
            <StatCard
              icon={TrendingUp}
              label="Percentage"
              value="91%"
              color="#0891b2"
            />
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">Recent Attendance</h3>
            <div className="grid grid-cols-7 gap-2">
              {[...Array(28)].map((_, i) => {
                const p = Math.random() > 0.15;
                return (
                  <div
                    key={i}
                    className={`h-8 rounded flex items-center justify-center text-xs font-medium ${p ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}
                  >
                    {i + 1}
                  </div>
                );
              })}
            </div>
            <div className="flex gap-4 mt-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-green-100 rounded inline-block" />
                Present
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-red-100 rounded inline-block" />
                Absent
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-2">
            {["manual", "qr"].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${mode === m ? "text-white" : "bg-white border border-gray-200 text-gray-600"}`}
                style={mode === m ? { background: R } : {}}
              >
                {m === "qr" ? (
                  <span className="flex items-center gap-2">
                    <QrCode size={14} />
                    QR Attendance
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <ClipboardList size={14} />
                    Manual
                  </span>
                )}
              </button>
            ))}
          </div>

          {mode === "qr" ? (
            <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm text-center">
              {!qrGenerated ? (
                <div>
                  <QrCode size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-600 mb-4">
                    Generate a QR code for students to scan
                  </p>
                  <button
                    onClick={() => setQrGenerated(true)}
                    className="px-6 py-2.5 rounded-lg text-white font-semibold"
                    style={{ background: R }}
                  >
                    Generate QR Code
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-500 mb-4">
                    Session active – Students scan this QR to mark attendance
                  </p>
                  <QrPlaceholder value="TN-ATT-2082-01-28" size={160} />
                  <p className="text-sm font-semibold text-green-600 mt-4 flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    12 students scanned
                  </p>
                  <button
                    onClick={() => setQrGenerated(false)}
                    className="mt-4 px-5 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
                  >
                    End Session
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-50 flex items-center justify-between">
                <p className="font-semibold text-gray-800 text-sm">
                  Baisakh 28, 2082 – Morning Batch
                </p>
                <button
                  className="px-4 py-1.5 rounded-lg text-white text-xs font-semibold"
                  style={{ background: R }}
                >
                  Save Attendance
                </button>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      Student
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      Class
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      Toggle
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {attendance.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 font-semibold text-gray-900">
                        {s.name}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        Class {s.class}
                      </td>
                      <td className="px-4 py-3">
                        <Badge status={s.status} />
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggle(s.id)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${s.status === "present" ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-green-50 text-green-600 hover:bg-green-100"}`}
                        >
                          Mark {s.status === "present" ? "Absent" : "Present"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function FeesPage({ role }) {
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);

  if (role === "student") {
    const fee = FEES[0];
    return (
      <div className="space-y-4">
        <SectionHeader title="Fee Status" subtitle="Your payment history" />
        <div className="grid grid-cols-3 gap-4">
          <StatCard
            icon={CreditCard}
            label="Monthly Fee"
            value="Rs. 3,000"
            color="#0891b2"
          />
          <StatCard
            icon={CheckCircle}
            label="Paid"
            value="Rs. 3,000"
            color="#16a34a"
          />
          <StatCard
            icon={AlertCircle}
            label="Balance Due"
            value="Rs. 0"
            color="#16a34a"
          />
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">Payment History</h3>
            <button className="flex items-center gap-2 text-sm text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50">
              <Download size={13} />
              Receipt
            </button>
          </div>
          {FEES.filter((f) => f.student === "S001").map((f) => (
            <div
              key={f.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
            >
              <div>
                <p className="font-semibold text-gray-900">{f.month}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Paid: {f.date || "—"}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">
                  Rs. {f.amount.toLocaleString()}
                </p>
                <Badge status={f.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <SectionHeader
        title="Fee Management"
        subtitle="Track monthly fees & installments"
        action={
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-semibold"
            style={{ background: R }}
          >
            <Plus size={14} />
            Record Payment
          </button>
        }
      />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={CreditCard}
          label="Total Expected"
          value="Rs. 3.15L"
          color="#0891b2"
        />
        <StatCard
          icon={CheckCircle}
          label="Collected"
          value="Rs. 2.4L"
          color="#16a34a"
        />
        <StatCard
          icon={AlertCircle}
          label="Pending"
          value="Rs. 0.75L"
          color={R}
        />
        <StatCard
          icon={TrendingUp}
          label="Collection Rate"
          value="76%"
          color="#7c3aed"
        />
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                {[
                  "Student",
                  "Month",
                  "Total",
                  "Paid",
                  "Due",
                  "Status",
                  "Action",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {FEES.map((f) => (
                <tr key={f.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-semibold text-gray-900">
                    {f.name}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{f.month}</td>
                  <td className="px-4 py-3 text-gray-900">
                    Rs. {f.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-green-600 font-semibold">
                    Rs. {f.paid.toLocaleString()}
                  </td>
                  <td
                    className="px-4 py-3 font-semibold"
                    style={{ color: f.due > 0 ? R : "#16a34a" }}
                  >
                    Rs. {f.due.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <Badge status={f.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setSelected(f);
                          setModal("receipt");
                        }}
                        className="p-1.5 rounded hover:bg-blue-50 text-blue-500"
                      >
                        <Printer size={13} />
                      </button>
                      {f.status !== "paid" && (
                        <button className="p-1.5 rounded hover:bg-green-50 text-green-600">
                          <Plus size={13} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={modal === "receipt" && !!selected}
        onClose={() => setModal(null)}
        title="Fee Receipt"
      >
        {selected && (
          <div className="text-sm space-y-4">
            <div className="text-center border-b pb-4">
              <p className="font-black text-lg text-gray-900">
                TRI·NETRA TUITION CENTER
              </p>
              <p className="text-gray-500 text-xs">
                Godawari-3, Taukhel · 9840456962
              </p>
              <p className="text-xs text-gray-400 mt-1">Fee Receipt</p>
            </div>
            <div className="space-y-2">
              {[
                ["Student", selected.name],
                ["Month", selected.month],
                ["Total Amount", `Rs. ${selected.amount.toLocaleString()}`],
                ["Paid", `Rs. ${selected.paid.toLocaleString()}`],
                ["Balance", `Rs. ${selected.due.toLocaleString()}`],
                ["Status", selected.status],
                ["Date", selected.date || "—"],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex justify-between py-1.5 border-b border-gray-50"
                >
                  <span className="text-gray-500">{k}</span>
                  <span className="font-semibold text-gray-900 capitalize">
                    {v}
                  </span>
                </div>
              ))}
            </div>
            <button
              className="w-full py-2.5 rounded-lg text-white font-semibold flex items-center justify-center gap-2"
              style={{ background: R }}
            >
              <Download size={14} />
              Download Receipt
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}

function ExamsPage({ role }) {
  const studentExams = EXAMS.filter((e) => e.student === "S001");
  const avgGpa = (
    studentExams.reduce((a, b) => a + b.gpa, 0) / studentExams.length
  ).toFixed(1);

  if (role === "student") {
    return (
      <div className="space-y-4">
        <SectionHeader
          title="My Results"
          subtitle="Weekly test scores and GPA"
        />
        <div className="grid grid-cols-3 gap-4">
          <StatCard
            icon={Award}
            label="Avg GPA"
            value={avgGpa}
            color="#7c3aed"
          />
          <StatCard
            icon={TrendingUp}
            label="Avg Marks"
            value="81.7%"
            color="#16a34a"
          />
          <StatCard icon={Star} label="Grade" value="A" color="#f59e0b" />
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                {[
                  "Subject",
                  "Marks",
                  "Total",
                  "Percentage",
                  "Grade",
                  "GPA",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {studentExams.map((e) => {
                const g = getGrade(e.marks, e.total);
                return (
                  <tr key={e.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      {e.subject}
                    </td>
                    <td className="px-4 py-3 text-gray-900">{e.marks}</td>
                    <td className="px-4 py-3 text-gray-500">{e.total}</td>
                    <td className="px-4 py-3 text-gray-900">
                      {((e.marks / e.total) * 100).toFixed(0)}%
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-black" style={{ color: g.color }}>
                        {g.grade}
                      </span>
                    </td>
                    <td
                      className="px-4 py-3 font-bold"
                      style={{ color: g.color }}
                    >
                      {g.gpa}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SectionHeader
        title="Exams & Results"
        subtitle="Weekly test scores management"
        action={
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-semibold"
            style={{ background: R }}
          >
            <Plus size={14} />
            Enter Marks
          </button>
        }
      />
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              {[
                "Student",
                "Subject",
                "Marks",
                "Total",
                "Percentage",
                "Grade",
                "GPA",
                "Date",
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {EXAMS.map((e) => {
              const g = getGrade(e.marks, e.total);
              return (
                <tr key={e.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-semibold text-gray-900">
                    {e.name}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{e.subject}</td>
                  <td className="px-4 py-3 text-gray-900 font-semibold">
                    {e.marks}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{e.total}</td>
                  <td className="px-4 py-3">
                    {((e.marks / e.total) * 100).toFixed(0)}%
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="font-black text-sm"
                      style={{ color: g.color }}
                    >
                      {g.grade}
                    </span>
                  </td>
                  <td
                    className="px-4 py-3 font-bold"
                    style={{ color: g.color }}
                  >
                    {g.gpa}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{e.date}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AnnouncementsPage({ role }) {
  const [modal, setModal] = useState(false);
  return (
    <div>
      <SectionHeader
        title="Announcements"
        subtitle="Notices from administration & teachers"
        action={
          role !== "student" && (
            <button
              onClick={() => setModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-semibold"
              style={{ background: R }}
            >
              <Plus size={14} />
              Post Notice
            </button>
          )
        }
      />
      <div className="space-y-3">
        {ANNOUNCEMENTS.map((a) => (
          <div
            key={a.id}
            className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: (a.role === "admin" ? R : "#0891b2") + "15",
                }}
              >
                <Bell
                  size={16}
                  style={{ color: a.role === "admin" ? R : "#0891b2" }}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h3 className="font-bold text-gray-900">{a.title}</h3>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${a.role === "admin" ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"}`}
                    >
                      {a.role}
                    </span>
                    <span className="text-xs text-gray-400">{a.date}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1.5">{a.body}</p>
                <p className="text-xs text-gray-400 mt-2">— {a.author}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title="Post Announcement"
      >
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Title
            </label>
            <input
              placeholder="Announcement title"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Message
            </label>
            <textarea
              rows={4}
              placeholder="Write your announcement…"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none resize-none"
            />
          </div>
          <button
            className="w-full py-2.5 rounded-lg text-white font-semibold text-sm"
            style={{ background: R }}
          >
            Post Announcement
          </button>
        </div>
      </Modal>
    </div>
  );
}

function ReportsPage() {
  const reports = [
    {
      title: "Student Performance Report",
      desc: "All students with GPA, grades, percentage",
      icon: Award,
      color: "#7c3aed",
    },
    {
      title: "Attendance Report",
      desc: "Monthly attendance by student and batch",
      icon: UserCheck,
      color: "#0891b2",
    },
    {
      title: "Fee Collection Report",
      desc: "Fee status, paid, pending, installments",
      icon: CreditCard,
      color: "#16a34a",
    },
    {
      title: "Exam Marks Report",
      desc: "Weekly test results for all classes",
      icon: BookOpen,
      color: "#f59e0b",
    },
    {
      title: "Teacher Report",
      desc: "Teacher-wise class and batch summary",
      icon: GraduationCap,
      color: R,
    },
    {
      title: "Batch Summary",
      desc: "Batch-wise student count and stats",
      icon: Users,
      color: "#0f766e",
    },
  ];
  return (
    <div>
      <SectionHeader
        title="Reports"
        subtitle="Export PDF reports for management"
      />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((r) => (
          <div
            key={r.title}
            className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all group cursor-pointer"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
              style={{ background: r.color + "15" }}
            >
              <r.icon size={18} style={{ color: r.color }} />
            </div>
            <h3 className="font-bold text-gray-900 text-sm">{r.title}</h3>
            <p className="text-xs text-gray-500 mt-1 mb-4">{r.desc}</p>
            <button
              className="flex items-center gap-2 text-xs font-semibold text-white px-3 py-1.5 rounded-lg"
              style={{ background: r.color }}
            >
              <Download size={12} />
              Export PDF
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── STUDENT PROFILE / ID CARD ─────────────────────────────────────────────────
function StudentProfile() {
  const s = STUDENTS[0];
  return (
    <div className="max-w-sm mx-auto">
      <SectionHeader title="My ID Card" subtitle="Download or share your ID" />
      <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
        {/* Header */}
        <div
          className="px-6 py-5 text-white text-center"
          style={{
            background: `linear-gradient(135deg, ${DARK} 0%, #374151 100%)`,
          }}
        >
          <p className="font-black text-lg">TRI·NETRA</p>
          <p className="text-xs text-gray-300">Tuition Center — Estd. 2082</p>
          <p className="text-xs text-gray-400 mt-0.5">Godawari-3, Taukhel</p>
        </div>
        {/* Red strip */}
        <div className="h-1.5" style={{ background: R }} />
        {/* Body */}
        <div className="px-6 py-6">
          <div className="flex items-center gap-4 mb-5">
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-2xl font-black flex-shrink-0"
              style={{ background: R }}
            >
              {s.name.charAt(0)}
            </div>
            <div>
              <p className="font-black text-gray-900 text-lg">{s.name}</p>
              <p className="text-gray-500 text-sm">
                Class {s.class} · {s.batch} Batch
              </p>
              <p className="font-mono text-xs text-gray-400">{s.id}</p>
            </div>
          </div>
          <div className="space-y-2 text-sm mb-5">
            {[
              ["Phone", s.phone],
              ["Parent", s.parent],
              ["Joined", s.joined],
            ].map(([k, v]) => (
              <div
                key={k}
                className="flex justify-between py-1.5 border-b border-gray-50"
              >
                <span className="text-gray-400">{k}</span>
                <span className="font-semibold text-gray-800">{v}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <QrPlaceholder value={s.id} size={100} />
          </div>
        </div>
        {/* Footer */}
        <div className="h-1.5" style={{ background: R }} />
        <div className="px-6 py-3 bg-gray-50 flex gap-2">
          <button
            className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold text-white rounded-lg"
            style={{ background: R }}
          >
            <Download size={13} />
            Download
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100">
            <Printer size={13} />
            Print
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── TEACHER DASHBOARD ─────────────────────────────────────────────────────────
function TeacherDashboard() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Teacher Dashboard"
        subtitle="Ramesh Sharma · Mathematics · Morning Batch"
      />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="My Students" value="42" color="#0891b2" />
        <StatCard
          icon={UserCheck}
          label="Avg Attendance"
          value="90%"
          color="#16a34a"
        />
        <StatCard icon={Award} label="Avg GPA" value="3.2" color="#7c3aed" />
        <StatCard icon={Bell} label="Announcements" value="3" color={R} />
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Assigned Batches</h3>
          <div className="space-y-3">
            {[
              "Class 9 – Morning Batch",
              "Class 10 – Morning Batch",
              "Class 11 – Morning Batch",
            ].map((b) => (
              <div
                key={b}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <BookOpen size={14} style={{ color: R }} />
                  <span className="text-sm font-semibold text-gray-800">
                    {b}
                  </span>
                </div>
                <span className="text-xs text-gray-400">6:00–8:00 AM</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: QrCode, label: "QR Attendance" },
              { icon: ClipboardList, label: "Manual Attendance" },
              { icon: Plus, label: "Enter Marks" },
              { icon: Bell, label: "Post Notice" },
            ].map(({ icon: I, label }) => (
              <button
                key={label}
                className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl hover:bg-red-50 transition-all group border border-transparent hover:border-red-100"
              >
                <I
                  size={20}
                  className="text-gray-400 group-hover:text-red-500"
                />
                <span className="text-xs font-semibold text-gray-600 group-hover:text-red-600">
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── STUDENT DASHBOARD ─────────────────────────────────────────────────────────
function StudentDashboardView() {
  const s = STUDENTS[0];
  return (
    <div className="space-y-6">
      <SectionHeader
        title="My Dashboard"
        subtitle={`${s.name} · Class ${s.class} · ${s.batch} Batch`}
      />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={UserCheck}
          label="Attendance"
          value={`${s.attendance}%`}
          color="#16a34a"
        />
        <StatCard icon={Award} label="GPA" value={s.gpa} color="#7c3aed" />
        <StatCard
          icon={CreditCard}
          label="Fee Status"
          value="Paid"
          color="#16a34a"
        />
        <StatCard icon={Bell} label="Notices" value="4" color={R} />
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Subject Performance</h3>
          <div className="space-y-3">
            {[
              ["Mathematics", "88/100", "A+"],
              ["Science", "82/100", "A"],
              ["English", "75/100", "B+"],
            ].map(([subj, marks, grade]) => (
              <div key={subj} className="flex items-center gap-4">
                <span className="text-sm font-semibold text-gray-700 w-28">
                  {subj}
                </span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width:
                        (marks.split("/")[0] / marks.split("/")[1]) * 100 + "%",
                      background: R,
                    }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-16 text-right">
                  {marks}
                </span>
                <span className="text-sm font-black w-8" style={{ color: R }}>
                  {grade}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Latest Notices</h3>
          <div className="space-y-3">
            {ANNOUNCEMENTS.slice(0, 3).map((a) => (
              <div key={a.id} className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs font-semibold text-gray-800">{a.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{a.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// MAIN APP
// ──────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("landing"); // landing | login | app
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogin = (u) => {
    setUser(u);
    setPage("dashboard");
    setView("app");
  };
  const handleLogout = () => {
    setUser(null);
    setView("landing");
    setPage("dashboard");
  };

  if (view === "landing")
    return <LandingPage onLogin={() => setView("login")} />;
  if (view === "login")
    return (
      <LoginPage onLogin={handleLogin} onBack={() => setView("landing")} />
    );

  const renderPage = () => {
    if (user.role === "student") {
      if (page === "dashboard") return <StudentDashboardView />;
      if (page === "profile") return <StudentProfile />;
      if (page === "attendance") return <AttendancePage role="student" />;
      if (page === "fees") return <FeesPage role="student" />;
      if (page === "exams") return <ExamsPage role="student" />;
      if (page === "announcements") return <AnnouncementsPage role="student" />;
    }
    if (user.role === "teacher") {
      if (page === "dashboard") return <TeacherDashboard />;
      if (page === "attendance") return <AttendancePage role="teacher" />;
      if (page === "exams") return <ExamsPage role="teacher" />;
      if (page === "announcements") return <AnnouncementsPage role="teacher" />;
    }
    if (user.role === "admin") {
      if (page === "dashboard") return <AdminDashboard />;
      if (page === "students") return <StudentsPage />;
      if (page === "teachers") return <TeachersPage />;
      if (page === "batches") return <BatchesPage />;
      if (page === "attendance") return <AttendancePage role="admin" />;
      if (page === "fees") return <FeesPage role="admin" />;
      if (page === "exams") return <ExamsPage role="admin" />;
      if (page === "announcements") return <AnnouncementsPage role="admin" />;
      if (page === "reports") return <ReportsPage />;
    }
    return <div className="text-gray-500">Page not found</div>;
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      <Sidebar
        role={user.role}
        page={page}
        setPage={setPage}
        user={user}
        onLogout={handleLogout}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-4 md:px-6 py-3 flex items-center gap-3 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-500"
          >
            <Menu size={18} />
          </button>
          <div className="flex-1">
            <h1 className="font-bold text-gray-900 text-sm capitalize">
              {page.replace(/([A-Z])/g, " $1")}
            </h1>
            <p className="text-xs text-gray-400">
              TRI-NETRA Tuition Center · 2082 B.S.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500">
              <Bell size={16} />
              <span
                className="absolute top-1 right-1 w-2 h-2 rounded-full"
                style={{ background: R }}
              />
            </button>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ background: R }}
            >
              {user.name.charAt(0)}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
