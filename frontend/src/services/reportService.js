import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export async function generateReport(reportType, params) {
  const response = await axios.post(`${API_BASE}/api/reports`, {
    type: reportType,
    ...params,
  });
  return response.data;
}

export async function downloadReport(reportId) {
  const response = await axios.get(`${API_BASE}/api/reports/${reportId}`, {
    responseType: "blob",
  });
  return response.data;
}
