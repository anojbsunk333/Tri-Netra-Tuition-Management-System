import React, { useEffect, useState } from "react";
import TeacherSidebar from "../../components/layout/TeacherSidebar";
import { getStudents } from "../../services/studentService";
import { createAttendance } from "../../services/attendanceService";

export default function TeacherAttendance() {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState("");
  const [batch, setBatch] = useState("Morning");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load students
  useEffect(() => {
    async function loadStudents() {
      try {
        setLoading(true);
        setError("");

        const data = await getStudents();
        setStudents(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load students.");
      } finally {
        setLoading(false);
      }
    }

    loadStudents();
  }, []);

  // Set today's date automatically
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    setDate(formattedDate);
  }, []);

  // Only students from selected batch
  const filteredStudents = students.filter(
    (student) =>
      String(student.batch).toLowerCase() === String(batch).toLowerCase(),
  );

  function markAttendance(studentId, status) {
    setAttendance((previous) => ({
      ...previous,
      [studentId]: status,
    }));
  }

  async function handleSaveAttendance() {
    setError("");
    setSuccess("");

    if (!date) {
      setError("Please select a date.");
      return;
    }

    if (filteredStudents.length === 0) {
      setError("No students found for this batch.");
      return;
    }

    const incomplete = filteredStudents.filter(
      (student) => !attendance[student.id],
    );

    if (incomplete.length > 0) {
      setError(
        `Please mark attendance for all students. ${incomplete.length} student(s) remaining.`,
      );
      return;
    }

    try {
      setSaving(true);

      for (const student of filteredStudents) {
        await createAttendance({
          studentId: student.id,
          name: student.name,
          batch: student.batch,
          date,
          status: attendance[student.id],
        });
      }

      setSuccess(
        `Attendance saved successfully for ${filteredStudents.length} student(s).`,
      );
    } catch (err) {
      console.error(err);

      setError(err.response?.data?.message || "Unable to save attendance.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <TeacherSidebar />

      <main className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Take Attendance</h1>

          <p className="mt-1 text-gray-600">
            Mark daily attendance for students.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Date
              </label>

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-primary-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Batch
              </label>

              <select
                value={batch}
                onChange={(e) => {
                  setBatch(e.target.value);
                  setAttendance({});
                  setSuccess("");
                  setError("");
                }}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-primary-500"
              >
                <option value="Morning">Morning</option>
                <option value="Day">Day</option>
                <option value="Evening">Evening</option>
              </select>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        {/* Student List */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">{batch} Batch</h2>

            <span className="text-sm text-gray-500">
              {filteredStudents.length} student(s)
            </span>
          </div>

          {loading ? (
            <p className="text-sm text-gray-500">Loading students...</p>
          ) : filteredStudents.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-gray-500">
                No students found in the {batch} batch.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Student ID
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Student Name
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Class
                    </th>

                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Attendance
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredStudents.map((student) => (
                    <tr key={student.id}>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {student.id}
                      </td>

                      <td className="px-4 py-4 text-sm font-medium text-gray-900">
                        {student.name}
                      </td>

                      <td className="px-4 py-4 text-sm text-gray-700">
                        {student.class}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              markAttendance(student.id, "present")
                            }
                            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                              attendance[student.id] === "present"
                                ? "bg-green-600 text-white"
                                : "bg-green-100 text-green-700 hover:bg-green-200"
                            }`}
                          >
                            Present
                          </button>

                          <button
                            type="button"
                            onClick={() => markAttendance(student.id, "absent")}
                            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                              attendance[student.id] === "absent"
                                ? "bg-red-600 text-white"
                                : "bg-red-100 text-red-700 hover:bg-red-200"
                            }`}
                          >
                            Absent
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Save */}
          {!loading && filteredStudents.length > 0 && (
            <div className="mt-6 flex justify-end border-t border-gray-200 pt-6">
              <button
                type="button"
                onClick={handleSaveAttendance}
                disabled={saving}
                className="rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Saving Attendance..." : "Save Attendance"}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
