import axios from "../api/axios";

export async function getFees() {
  const response = await axios.get("/api/fees");
  return response.data;
}

export async function getFeeSummary() {
  const response = await axios.get("/api/fees/summary");
  return response.data;
}

export async function recordPayment(id, paidAmount) {
  const response = await axios.post(`/api/fees/pay/${id}`, {
    paidAmount: Number(paidAmount),
  });

  return response.data;
}

export async function createFee(feeData) {
  const response = await axios.post("/api/fees", feeData);
  return response.data;
}

export async function updateFee(id, feeData) {
  const response = await axios.put(`/api/fees/${id}`, feeData);
  return response.data;
}

export async function deleteFee(id) {
  const response = await axios.delete(`/api/fees/${id}`);
  return response.data;
}

export async function bulkGenerateFees(entries) {
  const response = await axios.post("/api/fees/bulk-generate", {
    entries,
  });

  return response.data;
}

export async function getPayments() {
  const response = await axios.get("/api/payments");
  return response.data;
}

export async function getPayment(id) {
  const response = await axios.get(`/api/payments/${id}`);
  return response.data;
}