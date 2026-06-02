import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export async function getTeachers() {
  const response = await axios.get(`${API_BASE}/api/teachers`);
  return response.data;
}

export async function createTeacher(teacherData) {
  const response = await axios.post(`${API_BASE}/api/teachers`, teacherData);
  return response.data;
}

export async function updateTeacher(id, teacherData) {
  const response = await axios.put(
    `${API_BASE}/api/teachers/${id}`,
    teacherData,
  );
  return response.data;
}

export async function deleteTeacher(id) {
  const response = await axios.delete(`${API_BASE}/api/teachers/${id}`);
  return response.data;
}
