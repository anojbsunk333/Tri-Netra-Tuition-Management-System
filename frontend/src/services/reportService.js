import axios from "../api/axios";

export async function getFeeReport(params = {}) {
  const response = await axios.get("/api/reports/fees", { params });
  return response.data;
}

export async function getAttendanceReport(params = {}) {
  const response = await axios.get("/api/reports/attendance", { params });
  return response.data;
}

export async function getStudentReport(studentId) {
  const response = await axios.get(`/api/reports/student/${studentId}`);
  return response.data;
}
