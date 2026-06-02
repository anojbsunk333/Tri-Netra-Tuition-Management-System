import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export async function getExams() {
  const response = await axios.get(`${API_BASE}/api/exams`);
  return response.data;
}

export async function createExam(examData) {
  const response = await axios.post(`${API_BASE}/api/exams`, examData);
  return response.data;
}

export async function updateExam(id, examData) {
  const response = await axios.put(`${API_BASE}/api/exams/${id}`, examData);
  return response.data;
}

export async function deleteExam(id) {
  const response = await axios.delete(`${API_BASE}/api/exams/${id}`);
  return response.data;
}
