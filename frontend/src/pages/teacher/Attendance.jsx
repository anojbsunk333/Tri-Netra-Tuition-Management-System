import React, { useState } from "react";
import TeacherSidebar from "../../components/layout/TeacherSidebar";

export default function TeacherAttendance() {
  const [attendanceMode, setAttendanceMode] = useState("qr"); // "qr" or "manual"

  return (
    <div className="flex min-h-screen bg-gray-50">
      <TeacherSidebar />
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-primary-900 mb-6">
            Take Attendance
          </h1>

          {/* Mode Selector */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-primary-200 p-6 mb-6">
            <div className="flex gap-4">
              <button
                onClick={() => setAttendanceMode("qr")}
                className={`flex-1 py-3 rounded-lg font-semibold transition ${
                  attendanceMode === "qr"
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                QR Code Scanner
              </button>
              <button
                onClick={() => setAttendanceMode("manual")}
                className={`flex-1 py-3 rounded-lg font-semibold transition ${
                  attendanceMode === "manual"
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Manual Entry
              </button>
            </div>
          </div>

          {/* Content based on mode */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-primary-200 p-8">
            {attendanceMode === "qr" ? (
              <div className="text-center">
                <p className="text-2xl text-gray-600 mb-4">
                  📱 QR Code Scanner
                </p>
                <p className="text-gray-500">
                  QR scanner component will be integrated here
                </p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-2xl text-gray-600 mb-4">
                  ✍️ Manual Attendance
                </p>
                <p className="text-gray-500">
                  Manual entry form will be integrated here
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
