import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export async function getStudents() {
  const response = await axios.get(`${API_BASE}/api/students`);
  return response.data;
}

export async function createStudent(studentData) {
  const response = await axios.post(`${API_BASE}/api/students`, studentData);
  return response.data;
}

export async function updateStudent(id, studentData) {
  const response = await axios.put(
    `${API_BASE}/api/students/${id}`,
    studentData,
  );
  return response.data;
}

export async function deleteStudent(id) {
  const response = await axios.delete(`${API_BASE}/api/students/${id}`);
  return response.data;
}
