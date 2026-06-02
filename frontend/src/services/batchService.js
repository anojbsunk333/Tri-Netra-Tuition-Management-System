import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export async function getBatches() {
  const response = await axios.get(`${API_BASE}/api/batches`);
  return response.data;
}

export async function createBatch(batchData) {
  const response = await axios.post(`${API_BASE}/api/batches`, batchData);
  return response.data;
}

export async function updateBatch(id, batchData) {
  const response = await axios.put(`${API_BASE}/api/batches/${id}`, batchData);
  return response.data;
}

export async function deleteBatch(id) {
  const response = await axios.delete(`${API_BASE}/api/batches/${id}`);
  return response.data;
}
