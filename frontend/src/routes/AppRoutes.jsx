import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePublic from "../pages/public/Home";
import LoginPublic from "../pages/public/Login";
import RegisterPublic from "../pages/public/Register";
import AboutPublic from "../pages/public/About";
import NotFound from "../pages/public/NotFound";
import AdminDashboard from "../pages/admin/Dashboard";
import Students from "../pages/admin/Students";
import Teachers from "../pages/admin/Teachers";
import Fees from "../pages/admin/Fees";
import AttendanceAdmin from "../pages/admin/Attendance";
import TeacherDashboard from "../pages/teacher/Dashboard";
import TeacherAttendance from "../pages/teacher/Attendance";
import TeacherExams from "../pages/teacher/Exams";
import StudentDashboard from "../pages/student/Dashboard";
import Results from "../pages/student/Results";
import Profile from "../pages/student/Profile";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePublic />} />
        <Route path="/login" element={<LoginPublic />} />
        <Route path="/login/:role" element={<LoginPublic />} />
        <Route path="/register" element={<RegisterPublic />} />
        <Route path="/about" element={<AboutPublic />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/students"
          element={
            <ProtectedRoute role="admin">
              <Students />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/teachers"
          element={
            <ProtectedRoute role="admin">
              <Teachers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/fees"
          element={
            <ProtectedRoute role="admin">
              <Fees />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/attendance"
          element={
            <ProtectedRoute role="admin">
              <AttendanceAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/dashboard"
          element={
            <ProtectedRoute role="teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/attendance"
          element={
            <ProtectedRoute role="teacher">
              <TeacherAttendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/exams"
          element={
            <ProtectedRoute role="teacher">
              <TeacherExams />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/results"
          element={
            <ProtectedRoute role="student">
              <Results />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/profile"
          element={
            <ProtectedRoute role="student">
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
