import React from "react";
import { useAuth } from "../../context/AuthContext";

export default function AdminDashboard() {
  const { user, setUser } = useAuth();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="rounded-2xl bg-white p-8 shadow-lg border-2 border-primary-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-primary-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-2">Welcome back, {user.name}!</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Logged in as</p>
                <p className="font-semibold text-primary-900">{user.email}</p>
              </div>
              <button
                onClick={() => setUser(null)}
                className="rounded-2xl bg-red-600 text-white px-6 py-2 hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-6 border border-blue-200">
              <p className="text-gray-600 text-sm">Total Students</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">0</p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-green-50 to-green-100 p-6 border border-green-200">
              <p className="text-gray-600 text-sm">Total Teachers</p>
              <p className="text-3xl font-bold text-green-900 mt-2">0</p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 p-6 border border-purple-200">
              <p className="text-gray-600 text-sm">Total Batches</p>
              <p className="text-3xl font-bold text-purple-900 mt-2">0</p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 p-6 border border-orange-200">
              <p className="text-gray-600 text-sm">Total Fees</p>
              <p className="text-3xl font-bold text-orange-900 mt-2">0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
