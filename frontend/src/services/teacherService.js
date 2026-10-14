import axios from "../api/axios";

export async function getTeachers() {
  const response = await axios.get("/api/teachers");
  return response.data;
}

export async function createTeacher(teacherData) {
  const response = await axios.post("/api/teachers", teacherData);
  return response.data;
}

export async function updateTeacher(id, teacherData) {
  const response = await axios.put(`/api/teachers/${id}`, teacherData);
  return response.data;
}

export async function deleteTeacher(id) {
  const response = await axios.delete(`/api/teachers/${id}`);
  return response.data;
}
