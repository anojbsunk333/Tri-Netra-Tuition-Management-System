import React, { useState } from "react";
import TeacherSidebar from "../../components/layout/TeacherSidebar";

export default function TeacherExams() {
  const [exams, setExams] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    examName: "",
    subject: "",
    totalMarks: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateExam = () => {
    if (
      formData.examName.trim() &&
      formData.subject.trim() &&
      formData.totalMarks
    ) {
      const newExam = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toLocaleDateString(),
      };
      setExams([newExam, ...exams]);
      setFormData({ examName: "", subject: "", totalMarks: "" });
      setShowForm(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <TeacherSidebar />
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-bold text-primary-900">
              Enter Results
            </h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition font-semibold"
            >
              {showForm ? "Cancel" : "Create Exam"}
            </button>
          </div>

          {/* Create Exam Form */}
          {showForm && (
            <div className="bg-white rounded-2xl shadow-lg border-2 border-primary-200 p-6 mb-6">
              <h2 className="text-2xl font-semibold text-primary-900 mb-4">
                Create New Exam
              </h2>
              <div className="space-y-4">
                <input
                  type="text"
                  name="examName"
                  placeholder="Exam Name (e.g., Mid-Term Test)"
                  value={formData.examName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                />
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                />
                <input
                  type="number"
                  name="totalMarks"
                  placeholder="Total Marks"
                  value={formData.totalMarks}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                />
                <button
                  onClick={handleCreateExam}
                  className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition font-semibold"
                >
                  Create Exam
                </button>
              </div>
            </div>
          )}

          {/* Exams List */}
          <div className="space-y-4">
            {exams.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg border-2 border-primary-200 p-8 text-center">
                <p className="text-gray-600 text-lg">No exams created yet</p>
              </div>
            ) : (
              exams.map((exam) => (
                <div
                  key={exam.id}
                  className="bg-white rounded-xl shadow-md border border-primary-100 p-6 hover:shadow-lg transition"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-primary-900">
                        {exam.examName}
                      </h3>
                      <p className="text-gray-600 mt-1">{exam.subject}</p>
                      <p className="text-gray-500 text-sm mt-2">
                        Total Marks: {exam.totalMarks} | Created:{" "}
                        {exam.createdAt}
                      </p>
                    </div>
                    <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition">
                      Enter Marks
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
