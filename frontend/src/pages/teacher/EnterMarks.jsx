import React, { useEffect, useState } from "react";
import TeacherSidebar from "../../components/layout/TeacherSidebar";
import { getExams, createExam } from "../../services/examService";
import { getStudents } from "../../services/studentService";

export default function EnterMarks() {
  const [students, setStudents] = useState([]);
  const [exams, setExams] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

 const [formData, setFormData] = useState({
  
   examName: "",
   student: "",
   subject: "",
   marks: "",
   total: "100",
   date: new Date().toISOString().split("T")[0],
 });
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [studentData, examData] = await Promise.all([
        getStudents(),
        getExams(),
      ]);

      setStudents(studentData || []);
      setExams(examData || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load students or exam records.");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      const selectedStudent = students.find(
        (student) => String(student.id) === String(formData.student),
      );

      if (!selectedStudent) {
        setError("Please select a student.");
        return;
      }

      const newExam = await createExam({
        examName: formData.examName,

        student: selectedStudent.id,

        name:
          selectedStudent.name || selectedStudent.fullName || "Unknown Student",

        subject: formData.subject,

        marks: Number(formData.marks),

        total: Number(formData.total),

        date: new Date(formData.date).toISOString(),
      });
      setExams((previous) => [newExam, ...previous]);

      setSuccess("Marks entered successfully.");

     setFormData({
       examName: "",
       student: "",
       subject: "",
       marks: "",
       total: "100",
       date: new Date().toISOString().split("T")[0],
     });
    } catch (err) {
      console.error(err);

      setError(err.response?.data?.message || "Unable to save marks.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <TeacherSidebar />

      <main className="flex-1 p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Header */}

          <div className="rounded-2xl border-2 border-primary-200 bg-white p-8 shadow-lg">
            <h1 className="text-3xl font-bold text-primary-900">
              Enter Student Marks
            </h1>

            <p className="mt-2 text-gray-600">
              Add and manage student examination results.
            </p>
          </div>

          {/* Enter Marks Form */}

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
            <h2 className="mb-6 text-xl font-bold text-gray-900">
              Add Exam Result
            </h2>

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 rounded-lg bg-green-50 p-4 text-sm text-green-700">
                {success}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
            >
              {/* Exam Name */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Exam Name
                </label>

                <input
                  type="text"
                  name="examName"
                  value={formData.examName}
                  onChange={handleChange}
                  placeholder="Example: First Terminal Examination"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-primary-500"
                />
              </div>

              {/* Student */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Student
                </label>

                <select
                  name="student"
                  value={formData.student}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-primary-500"
                >
                  <option value="">Select Student</option>

                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name || student.fullName || student.id}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Subject
                </label>

                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Example: Mathematics"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-primary-500"
                />
              </div>

              {/* Marks */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Obtained Marks
                </label>

                <input
                  type="number"
                  name="marks"
                  value={formData.marks}
                  onChange={handleChange}
                  min="0"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-primary-500"
                />
              </div>

              {/* Total */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Full Marks
                </label>

                <input
                  type="number"
                  name="total"
                  value={formData.total}
                  onChange={handleChange}
                  min="1"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-primary-500"
                />
              </div>

              {/* Date */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Exam Date
                </label>

                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-primary-500"
                />
              </div>

              {/* Button */}

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-lg bg-primary-600 px-4 py-3 font-semibold text-white transition hover:bg-primary-700 disabled:opacity-60"
                >
                  {submitting ? "Saving..." : "Save Marks"}
                </button>
              </div>
            </form>
          </div>

          {/* Recent Results */}

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Recent Exam Results
              </h2>

              <span className="text-sm text-gray-500">
                {exams.length} record(s)
              </span>
            </div>

            {loading ? (
              <p className="text-gray-500">Loading exam records...</p>
            ) : exams.length === 0 ? (
              <p className="py-8 text-center text-gray-500">
                No exam results found.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                        Student
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                        Subject
                      </th>

                      <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-gray-600">
                        Marks
                      </th>

                      <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-gray-600">
                        Grade
                      </th>

                      <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-gray-600">
                        GPA
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {exams.map((exam) => (
                      <tr key={exam.id}>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {exam.name}
                        </td>

                        <td className="px-4 py-3 text-sm text-gray-700">
                          {exam.subject}
                        </td>

                        <td className="px-4 py-3 text-center text-sm text-gray-700">
                          {exam.marks}/{exam.total}
                        </td>

                        <td className="px-4 py-3 text-center">
                          <span className="rounded-full bg-primary-100 px-3 py-1 text-sm font-semibold text-primary-700">
                            {exam.grade}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                          {exam.gpa}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
