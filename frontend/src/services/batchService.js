import axios from "../api/axios";

export async function getBatches() {
  const response = await axios.get("/api/batches");
  return response.data;
}

export async function createBatch(batchData) {
  const response = await axios.post("/api/batches", batchData);
  return response.data;
}

export async function updateBatch(id, batchData) {
  const response = await axios.put(`/api/batches/${id}`, batchData);
  return response.data;
}

export async function deleteBatch(id) {
  const response = await axios.delete(`/api/batches/${id}`);
  return response.data;
}
