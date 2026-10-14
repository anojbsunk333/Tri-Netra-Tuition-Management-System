import React, { useEffect, useState } from "react";
import StudentSidebar from "../../components/layout/StudentSidebar";
import Badge from "../../components/Badge";
import { getMyStudentOverview } from "../../services/studentPortalService";

export default function MyAttendance() {
  const [records, setRecords] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  useEffect(() => { getMyStudentOverview().then(({ attendance }) => setRecords(attendance || [])).catch(() => setError("Unable to load your attendance.")).finally(() => setLoading(false)); }, []);
  const present = records.filter(item => item.status === "present").length;
  const percentage = records.length ? Math.round(present / records.length * 100) : 0;
  return <div className="flex min-h-screen bg-gray-50"><StudentSidebar /><main className="flex-1 p-6"><div className="max-w-6xl mx-auto">
    <div className="mb-8"><h1 className="text-4xl font-bold text-gray-900 mb-2">My Attendance</h1><p className="text-gray-600">Attendance marked by your teacher.</p></div>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">{[["Overall attendance", `${percentage}%`], ["Days present", present], ["Days absent", records.length - present], ["Status", percentage >= 75 ? "Good" : "Needs attention"]].map(([label,value]) => <div key={label} className="rounded-xl bg-white p-6 shadow-md border"><p className="text-gray-600 text-sm">{label}</p><p className="text-2xl font-bold text-primary-900 mt-2">{value}</p></div>)}</div>
    <section className="rounded-xl bg-white shadow-md border overflow-hidden"><div className="p-6 border-b"><h2 className="text-2xl font-bold">Attendance Records</h2></div>{loading ? <p className="p-6 text-center">Loading attendance...</p> : error ? <p className="p-6 text-center text-red-600">{error}</p> : records.length ? <div className="overflow-x-auto"><table className="w-full"><thead className="bg-gray-50"><tr>{["Date","Batch","Status","Source"].map(h => <th key={h} className="px-6 py-3 text-left text-sm font-semibold">{h}</th>)}</tr></thead><tbody className="divide-y">{records.map(record => <tr key={record.id}><td className="px-6 py-4">{record.date}</td><td className="px-6 py-4">{record.batch || "—"}</td><td className="px-6 py-4"><Badge status={record.status} /></td><td className="px-6 py-4 capitalize">{record.source || "manual"}</td></tr>)}</tbody></table></div> : <p className="p-8 text-center text-gray-500">No attendance has been recorded yet.</p>}</section>
  </div></main></div>;
}
