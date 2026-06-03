import React, { useState } from "react";
import StudentSidebar from "../../components/layout/StudentSidebar";
import { useAuth } from "../../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();
  const [showQRCode, setShowQRCode] = useState(false);

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudentSidebar />
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              My Profile
            </h1>
            <p className="text-gray-600">
              View and manage your student profile information.
            </p>
          </div>

          {/* ID Card Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Student ID Card
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Digital ID Card */}
              <div className="rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 p-8 text-white shadow-lg transform hover:scale-105 transition">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm opacity-90">Student ID</p>
                    <p className="text-2xl font-bold">
                      {user.rollNumber || "S001"}
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                    <span className="text-3xl">📱</span>
                  </div>
                </div>

                <div className="border-t border-white border-opacity-30 pt-4 mb-4">
                  <p className="text-sm opacity-90">Student Name</p>
                  <p className="text-xl font-bold">{user.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="opacity-90">Class</p>
                    <p className="font-semibold text-lg">
                      {user.class || "10"}
                    </p>
                  </div>
                  <div>
                    <p className="opacity-90">Batch</p>
                    <p className="font-semibold text-lg">
                      {user.batch || "Morning"}
                    </p>
                  </div>
                  <div>
                    <p className="opacity-90">School</p>
                    <p className="font-semibold">TRI·NETRA</p>
                  </div>
                  <div>
                    <p className="opacity-90">Year</p>
                    <p className="font-semibold">2082</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white border-opacity-30">
                  <p className="text-xs opacity-75">Valid Till: Falgun 2085</p>
                </div>
              </div>

              {/* Card Information */}
              <div className="space-y-4">
                <div className="rounded-xl bg-white p-6 shadow-md border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Card Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Roll Number</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {user.rollNumber || "S001"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Card Status</p>
                      <p className="text-lg font-semibold text-green-600">
                        ✅ Active
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Issue Date</p>
                      <p className="text-lg font-semibold text-gray-900">
                        Baishakh 1, 2082
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Expiry Date</p>
                      <p className="text-lg font-semibold text-gray-900">
                        Falgun 30, 2085
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition">
                    📥 Download ID Card (PDF)
                  </button>
                  <button className="w-full bg-gray-200 text-gray-900 py-3 rounded-lg font-medium hover:bg-gray-300 transition">
                    🖨️ Print ID Card
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Information Section */}
          <div className="rounded-xl bg-white p-6 shadow-md border border-gray-100 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Full Name</p>
                <p className="text-lg font-semibold text-gray-900">
                  {user.name || "Student Name"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Email Address</p>
                <p className="text-lg font-semibold text-gray-900">
                  {user.email || "student@school.com"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Class</p>
                <p className="text-lg font-semibold text-gray-900">
                  {user.class || "10"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Batch</p>
                <p className="text-lg font-semibold text-gray-900">
                  {user.batch || "Morning"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Roll Number</p>
                <p className="text-lg font-semibold text-gray-900">
                  {user.rollNumber || "S001"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <p className="text-lg font-semibold text-green-600">
                  ✅ Active
                </p>
              </div>
            </div>
          </div>

          {/* Account Settings Section */}
          <div className="rounded-xl bg-white p-6 shadow-md border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Account Settings
            </h2>
            <div className="space-y-4">
              <button className="w-full text-left p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">
                      Change Password
                    </p>
                    <p className="text-sm text-gray-600">
                      Update your account password
                    </p>
                  </div>
                  <span className="text-xl">→</span>
                </div>
              </button>

              <button className="w-full text-left p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">
                      Notification Preferences
                    </p>
                    <p className="text-sm text-gray-600">
                      Manage your notification settings
                    </p>
                  </div>
                  <span className="text-xl">→</span>
                </div>
              </button>

              <button className="w-full text-left p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">
                      Privacy Settings
                    </p>
                    <p className="text-sm text-gray-600">
                      Control your privacy options
                    </p>
                  </div>
                  <span className="text-xl">→</span>
                </div>
              </button>

              <button className="w-full text-left p-4 bg-red-50 rounded-lg border border-red-200 hover:bg-red-100 transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-red-900">Sign Out</p>
                    <p className="text-sm text-red-700">
                      Logout from your account
                    </p>
                  </div>
                  <span className="text-xl">→</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
