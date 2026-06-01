import React from "react";
import { useAuth } from "../../context/AuthContext";
import TeacherSidebar from "../../components/layout/TeacherSidebar";

export default function TeacherDashboard() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <TeacherSidebar />
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-2xl bg-white p-8 shadow-lg border-2 border-primary-200">
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-primary-900">
                Teacher Dashboard
              </h1>
              <p className="text-gray-600 mt-2">Welcome back, {user.name}!</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-6 border border-blue-200">
                <p className="text-gray-600 text-sm">Classes Today</p>
                <p className="text-3xl font-bold text-blue-900 mt-2">0</p>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-green-50 to-green-100 p-6 border border-green-200">
                <p className="text-gray-600 text-sm">Attendance</p>
                <p className="text-3xl font-bold text-green-900 mt-2">0%</p>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 p-6 border border-purple-200">
                <p className="text-gray-600 text-sm">Exams Created</p>
                <p className="text-3xl font-bold text-purple-900 mt-2">0</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
