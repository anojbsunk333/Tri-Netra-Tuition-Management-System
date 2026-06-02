import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export async function getFees() {
  const response = await axios.get(`${API_BASE}/api/fees`);
  return response.data;
}

export async function createFee(feeData) {
  const response = await axios.post(`${API_BASE}/api/fees`, feeData);
  return response.data;
}

export async function updateFee(id, feeData) {
  const response = await axios.put(`${API_BASE}/api/fees/${id}`, feeData);
  return response.data;
}

export async function deleteFee(id) {
  const response = await axios.delete(`${API_BASE}/api/fees/${id}`);
  return response.data;
}
