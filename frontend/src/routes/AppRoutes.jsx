import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "../pages/public/LandingPage";
import LoginPage from "../pages/public/LoginPage";
import RegisterPage from "../pages/public/Register";
import AboutPage from "../pages/public/AboutPage";
import NotFound from "../pages/public/NotFound";
import AdminDashboard from "../pages/admin/AdminDashboard";
import Students from "../pages/admin/Students";
import Teachers from "../pages/admin/Teachers";
import Batches from "../pages/admin/Batches";
import AttendanceAdmin from "../pages/admin/Attendance";
import Fees from "../pages/admin/Fees";
import Exams from "../pages/admin/Exams";
import Announcements from "../pages/admin/Announcements";
import Reports from "../pages/admin/Reports";
import TeacherDashboard from "../pages/teacher/TeacherDashboard";
import TeacherAttendance from "../pages/teacher/TakeAttendance";
import TeacherExams from "../pages/teacher/EnterMarks";
import TeacherAnnouncements from "../pages/teacher/Announcements";
import StudentDashboard from "../pages/student/StudentDashboard";
import MyResults from "../pages/student/Results";
import Profile from "../pages/student/Profile";
import RoleRoute from "./RoleRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/login/:role" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route
          path="/admin/dashboard"
          element={
            <RoleRoute role="admin">
              <AdminDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/students"
          element={
            <RoleRoute role="admin">
              <Students />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/teachers"
          element={
            <RoleRoute role="admin">
              <Teachers />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/batches"
          element={
            <RoleRoute role="admin">
              <Batches />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/fees"
          element={
            <RoleRoute role="admin">
              <Fees />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/attendance"
          element={
            <RoleRoute role="admin">
              <AttendanceAdmin />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/exams"
          element={
            <RoleRoute role="admin">
              <Exams />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/announcements"
          element={
            <RoleRoute role="admin">
              <Announcements />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <RoleRoute role="admin">
              <Reports />
            </RoleRoute>
          }
        />
        <Route
          path="/teacher/dashboard"
          element={
            <RoleRoute role="teacher">
              <TeacherDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/teacher/attendance"
          element={
            <RoleRoute role="teacher">
              <TeacherAttendance />
            </RoleRoute>
          }
        />
        <Route
          path="/teacher/exams"
          element={
            <RoleRoute role="teacher">
              <TeacherExams />
            </RoleRoute>
          }
        />
        <Route
          path="/teacher/announcements"
          element={
            <RoleRoute role="teacher">
              <TeacherAnnouncements />
            </RoleRoute>
          }
        />
        <Route
          path="/student/dashboard"
          element={
            <RoleRoute role="student">
              <StudentDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/student/results"
          element={
            <RoleRoute role="student">
              <MyResults />
            </RoleRoute>
          }
        />
        <Route
          path="/student/profile"
          element={
            <RoleRoute role="student">
              <Profile />
            </RoleRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
