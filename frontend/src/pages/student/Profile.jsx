import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentSidebar from "../../components/layout/StudentSidebar";
import { useAuth } from "../../context/AuthContext";
import { changeMyPassword, getMyStudentOverview, updateMyProfile } from "../../services/studentPortalService";
import {
  INVALID_NEPAL_MOBILE_MESSAGE,
  isValidNepalMobile,
} from "../../utils/phoneValidation";

export default function Profile() {
  const { user, setUser, logout } = useAuth(); const navigate = useNavigate();
  const [student, setStudent] = useState(null); const [name, setName] = useState(user?.name || ""); const [phone, setPhone] = useState(user?.phone || ""); const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" }); const [message, setMessage] = useState(""); const [saving, setSaving] = useState(false);
  useEffect(() => { getMyStudentOverview().then(data => setStudent(data.student)).catch(() => setMessage("Unable to load linked student details.")); }, []);
  const saveProfile = async event => { event.preventDefault(); if (phone.trim() && !isValidNepalMobile(phone)) { setMessage(INVALID_NEPAL_MOBILE_MESSAGE); return; } try { setSaving(true); const updated = await updateMyProfile({ name, phone }); setUser(updated); setMessage("Profile updated successfully."); } catch (error) { setMessage(error.response?.data?.message || "Could not update profile."); } finally { setSaving(false); } };
  const savePassword = async event => { event.preventDefault(); try { await changeMyPassword(passwords.oldPassword, passwords.newPassword); setPasswords({ oldPassword: "", newPassword: "" }); setMessage("Password changed successfully."); } catch (error) { setMessage(error.response?.data?.message || "Could not change password."); } };
  return <div className="flex min-h-screen bg-gray-50"><StudentSidebar /><main className="flex-1 p-6"><div className="max-w-4xl mx-auto">
    <div className="mb-8"><h1 className="text-4xl font-bold text-gray-900 mb-2">My Profile</h1><p className="text-gray-600">Manage your account and linked student information.</p></div>
    {message && <p className="mb-5 rounded-lg bg-blue-50 p-4 text-blue-800">{message}</p>}
    <section className="rounded-xl bg-gradient-to-r from-primary-700 to-indigo-700 text-white p-6 shadow mb-6"><p className="text-sm opacity-90">Student ID</p><p className="text-3xl font-bold">{student?.id || "Not linked"}</p><p className="mt-4">{student ? `${student.class || "—"} · ${student.batch || "—"}` : "Ask your administrator to link your student record to this account."}</p></section>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"><form onSubmit={saveProfile} className="rounded-xl bg-white p-6 shadow border"><h2 className="text-xl font-bold mb-5">Account details</h2><label className="block text-sm mb-1">Full name</label><input value={name} onChange={e => setName(e.target.value)} className="w-full border rounded-lg p-3 mb-4" required /><label className="block text-sm mb-1">Phone</label><input value={phone} onChange={e => setPhone(e.target.value)} className="w-full border rounded-lg p-3 mb-1" /><p className="text-xs text-gray-500 mb-4">Optional. Enter a 10-digit number starting with 97 or 98.</p><p className="text-sm text-gray-600 mb-4">Email: {user?.email}</p><button disabled={saving} className="w-full bg-primary-600 text-white rounded-lg p-3 disabled:opacity-50">{saving ? "Saving..." : "Save profile"}</button></form>
    <form onSubmit={savePassword} className="rounded-xl bg-white p-6 shadow border"><h2 className="text-xl font-bold mb-5">Change password</h2><label className="block text-sm mb-1">Current password</label><input type="password" value={passwords.oldPassword} onChange={e => setPasswords({ ...passwords, oldPassword: e.target.value })} className="w-full border rounded-lg p-3 mb-4" required /><label className="block text-sm mb-1">New password</label><input type="password" minLength="6" value={passwords.newPassword} onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })} className="w-full border rounded-lg p-3 mb-4" required /><button className="w-full bg-gray-900 text-white rounded-lg p-3">Update password</button><button type="button" onClick={() => { logout(); navigate("/login"); }} className="w-full mt-3 border border-red-300 text-red-700 rounded-lg p-3">Sign out</button></form></div>
  </div></main></div>;
}
