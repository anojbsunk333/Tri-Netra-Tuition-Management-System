// ─── BRAND COLORS ─────────────────────────────────────────────────────────────
export const R = "#DC2626"; // brand red
export const DARK = "#111827";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
export const USERS = [
  { id: 1, name: "Admin User", email: "admin@trinetra.edu.np", password: "local-demo-admin-only", role: "admin", phone: "9840456962" },
  { id: 2, name: "Ramesh Sharma", email: "ramesh@trinetra.edu.np", password: "local-demo-teacher-only", role: "teacher", phone: "9841234567", subject: "Mathematics", batch: "Morning" },
  { id: 3, name: "Sita Tamang", email: "sita@trinetra.edu.np", password: "local-demo-student-only", role: "student", phone: "9851234567", class: "10", batch: "Morning", rollNo: "S001", feeStatus: "paid" },
];

export const STUDENTS = [
  { id: "S001", name: "Sita Tamang", class: "10", batch: "Morning", phone: "9851234567", parent: "Ram Tamang", feeStatus: "paid", attendance: 92, gpa: 3.6, joined: "2082-01-15" },
  { id: "S002", name: "Bikash Thapa", class: "9", batch: "Day", phone: "9852345678", parent: "Hari Thapa", feeStatus: "due", attendance: 78, gpa: 2.8, joined: "2082-01-20" },
  { id: "S003", name: "Anita Karki", class: "12", batch: "Evening", phone: "9853456789", parent: "Mohan Karki", feeStatus: "partial", attendance: 85, gpa: 3.2, joined: "2081-06-10" },
  { id: "S004", name: "Rohan Adhikari", class: "11", batch: "Morning", phone: "9854567890", parent: "Suresh Adhikari", feeStatus: "paid", attendance: 95, gpa: 3.8, joined: "2082-02-01" },
  { id: "S005", name: "Priya Shrestha", class: "8", batch: "Day", phone: "9855678901", parent: "Binod Shrestha", feeStatus: "paid", attendance: 88, gpa: 3.4, joined: "2082-01-05" },
  { id: "S006", name: "Arjun Rai", class: "7", batch: "Evening", phone: "9856789012", parent: "Kumar Rai", feeStatus: "due", attendance: 70, gpa: 2.5, joined: "2082-02-15" },
  { id: "S007", name: "Manisha Gurung", class: "6", batch: "Morning", phone: "9857890123", parent: "Dil Gurung", feeStatus: "paid", attendance: 91, gpa: 3.5, joined: "2082-01-10" },
  { id: "S008", name: "Sunil Pandey", class: "5", batch: "Day", phone: "9858901234", parent: "Nabin Pandey", feeStatus: "partial", attendance: 82, gpa: 3.0, joined: "2082-01-25" },
];

export const TEACHERS = [
  { id: "T001", name: "Ramesh Sharma", subject: "Mathematics", batch: "Morning", phone: "9841234567", email: "ramesh@trinetra.edu.np", classes: ["9","10","11"], joined: "2079-05-01" },
  { id: "T002", name: "Sunita Adhikari", subject: "Science", batch: "Day", phone: "9842345678", email: "sunita@trinetra.edu.np", classes: ["8","9","10"], joined: "2080-01-15" },
  { id: "T003", name: "Dipak Joshi", subject: "English", batch: "Evening", phone: "9843456789", email: "dipak@trinetra.edu.np", classes: ["11","12"], joined: "2080-06-20" },
  { id: "T004", name: "Kamala Rai", subject: "Nepali", batch: "Morning", phone: "9844567890", email: "kamala@trinetra.edu.np", classes: ["3","4","5","6"], joined: "2081-02-10" },
];

export const BATCHES = [
  { id: "B1", name: "Morning", time: "6:00 AM – 8:00 AM", students: 42, teacher: "Ramesh Sharma", classes: ["9","10","11","12"] },
  { id: "B2", name: "Day", time: "11:00 AM – 1:00 PM", students: 35, teacher: "Sunita Adhikari", classes: ["7","8","9","10"] },
  { id: "B3", name: "Evening", time: "4:00 PM – 6:00 PM", students: 28, teacher: "Dipak Joshi", classes: ["3","4","5","6"] },
];

export const FEES = [
  { id: "F001", student: "S001", name: "Sita Tamang", month: "Baisakh 2082", amount: 3000, paid: 3000, due: 0, status: "paid", date: "2082-01-10" },
  { id: "F002", student: "S002", name: "Bikash Thapa", month: "Baisakh 2082", amount: 3000, paid: 0, due: 3000, status: "due", date: null },
  { id: "F003", student: "S003", name: "Anita Karki", month: "Baisakh 2082", amount: 3000, paid: 1500, due: 1500, status: "partial", date: "2082-01-18" },
  { id: "F004", student: "S004", name: "Rohan Adhikari", month: "Baisakh 2082", amount: 3000, paid: 3000, due: 0, status: "paid", date: "2082-01-05" },
  { id: "F005", student: "S005", name: "Priya Shrestha", month: "Baisakh 2082", amount: 3000, paid: 3000, due: 0, status: "paid", date: "2082-01-08" },
  { id: "F006", student: "S006", name: "Arjun Rai", month: "Baisakh 2082", amount: 3000, paid: 0, due: 3000, status: "due", date: null },
];

export const EXAMS = [
  { id: "E001", student: "S001", name: "Sita Tamang", subject: "Math", marks: 88, total: 100, date: "2082-01-25", grade: "A+", gpa: 4.0 },
  { id: "E002", student: "S001", name: "Sita Tamang", subject: "Science", marks: 82, total: 100, date: "2082-01-26", grade: "A", gpa: 3.6 },
  { id: "E003", student: "S001", name: "Sita Tamang", subject: "English", marks: 75, total: 100, date: "2082-01-27", grade: "B+", gpa: 3.2 },
  { id: "E004", student: "S002", name: "Bikash Thapa", subject: "Math", marks: 65, total: 100, date: "2082-01-25", grade: "B", gpa: 2.8 },
  { id: "E005", student: "S003", name: "Anita Karki", subject: "Math", marks: 71, total: 100, date: "2082-01-25", grade: "B+", gpa: 3.2 },
];

export const ANNOUNCEMENTS = [
  { id: 1, title: "Exam Schedule – Jestha 2082", body: "Weekly tests will be held every Friday from Jestha 1. Students must bring their ID cards.", author: "Admin", date: "2082-01-20", role: "admin" },
  { id: 2, title: "Fee Reminder – Baisakh Due", body: "All students with pending fees are requested to clear dues by Baisakh 30. Late fee of Rs. 100 will be charged.", author: "Admin", date: "2082-01-18", role: "admin" },
  { id: 3, title: "Mathematics Test – Class 10", body: "Chapter 5 & 6 test on Friday. Topics: Algebra, Quadratic Equations. Total marks: 30.", author: "Ramesh Sharma", date: "2082-01-22", role: "teacher" },
  { id: 4, title: "Holiday Notice – Baisakh 14", body: "The center will remain closed on Baisakh 14 for New Year celebration.", author: "Admin", date: "2082-01-12", role: "admin" },
];

export const monthlyIncome = [
  { month: "Ashwin", amount: 315000 }, { month: "Kartik", amount: 285000 },
  { month: "Mangsir", amount: 320000 }, { month: "Poush", amount: 295000 },
  { month: "Magh", amount: 310000 }, { month: "Falgun", amount: 330000 },
  { month: "Chaitra", amount: 305000 }, { month: "Baisakh", amount: 315000 },
];

export const attendanceTrend = [
  { week: "W1", present: 95 }, { week: "W2", present: 88 }, { week: "W3", present: 92 },
  { week: "W4", present: 85 }, { week: "W5", present: 90 }, { week: "W6", present: 94 },
];

export const feeDistrib = [
  { name: "Paid", value: 62, color: "#16a34a" },
  { name: "Partial", value: 18, color: "#f59e0b" },
  { name: "Due", value: 20, color: "#dc2626" },
];

// ─── GRADE CALC ───────────────────────────────────────────────────────────────
export function getGrade(marks, total) {
  const pct = (marks / total) * 100;
  if (pct >= 90) return { grade: "A+", gpa: 4.0, color: "#16a34a" };
  if (pct >= 80) return { grade: "A", gpa: 3.6, color: "#16a34a" };
  if (pct >= 70) return { grade: "B+", gpa: 3.2, color: "#2563eb" };
  if (pct >= 60) return { grade: "B", gpa: 2.8, color: "#2563eb" };
  if (pct >= 50) return { grade: "C+", gpa: 2.4, color: "#f59e0b" };
  if (pct >= 40) return { grade: "C", gpa: 2.0, color: "#f59e0b" };
  if (pct >= 35) return { grade: "D", gpa: 1.6, color: "#dc2626" };
  return { grade: "E", gpa: 0.0, color: "#dc2626" };
}
