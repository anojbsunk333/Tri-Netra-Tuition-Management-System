import axios from "../api/axios";

export async function getStudents() {
  const response = await axios.get("/api/students");
  return response.data;
}

export async function getStudent(id) {
  const response = await axios.get(`/api/students/${id}`);
  return response.data;
}

export async function createStudent(studentData) {
  const response = await axios.post("/api/students", studentData);
  return response.data;
}

export async function updateStudent(id, studentData) {
  const response = await axios.put(`/api/students/${id}`, studentData);
  return response.data;
}

export async function deleteStudent(id) {
  const response = await axios.delete(`/api/students/${id}`);
  return response.data;
}

