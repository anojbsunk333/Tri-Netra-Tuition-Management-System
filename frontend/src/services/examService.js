import axios from "../api/axios";

// Get all exams
export async function getExams() {
  const response = await axios.get("/api/exams");
  return response.data;
}

// Get exams/results of one student
export async function getStudentResults(studentId) {
  const response = await axios.get(`/api/exams/student/${studentId}`);
  return response.data;
}

// Create one exam result
export async function createExam(examData) {
  const response = await axios.post("/api/exams", examData);
  return response.data;
}

// Bulk create exam results
export async function bulkCreateExams(exams) {
  const response = await axios.post("/api/exams/bulk", {
    exams,
  });

  return response.data;
}

// Update exam
export async function updateExam(id, examData) {
  const response = await axios.put(`/api/exams/${id}`, examData);
  return response.data;
}

// Delete exam
export async function deleteExam(id) {
  const response = await axios.delete(`/api/exams/${id}`);
  return response.data;
}
