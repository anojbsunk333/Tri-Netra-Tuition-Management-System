import axios from "../api/axios";

export async function getAttendance() {
  const response = await axios.get("/api/attendance");
  return response.data;
}

export const getAttendanceRecords = getAttendance;

export async function createAttendance(attendanceData) {
  const response = await axios.post("/api/attendance", attendanceData);
  return response.data;
}

export async function updateAttendance(id, attendanceData) {
  const response = await axios.put(`/api/attendance/${id}`, attendanceData);
  return response.data;
}

export async function deleteAttendance(id) {
  const response = await axios.delete(`/api/attendance/${id}`);
  return response.data;
}

export async function getAttendanceReport(filters = {}) {
  const params = new URLSearchParams();

  if (filters.month) {
    params.append("month", filters.month);
  }

  if (filters.batch && filters.batch !== "all") {
    params.append("batch", filters.batch);
  }

  if (filters.studentId) {
    params.append("studentId", filters.studentId);
  }

  const query = params.toString();

  const response = await axios.get(
    `/api/attendance/report${query ? `?${query}` : ""}`,
  );

  return response.data;
}