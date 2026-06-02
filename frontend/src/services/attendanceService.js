import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export async function getAttendanceRecords() {
  const response = await axios.get(`${API_BASE}/api/attendance`);
  return response.data;
}

export async function createAttendanceRecord(recordData) {
  const response = await axios.post(`${API_BASE}/api/attendance`, recordData);
  return response.data;
}

export async function updateAttendanceRecord(id, recordData) {
  const response = await axios.put(
    `${API_BASE}/api/attendance/${id}`,
    recordData,
  );
  return response.data;
}

export async function deleteAttendanceRecord(id) {
  const response = await axios.delete(`${API_BASE}/api/attendance/${id}`);
  return response.data;
}
