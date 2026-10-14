import axios from "../api/axios";

export async function getPayments() {
  const response = await axios.get("/api/payments");
  return response.data;
}

export async function getPayment(id) {
  const response = await axios.get(`/api/payments/${id}`);
  return response.data;
}

export async function getPaymentsByFee(feeId) {
  const response = await axios.get(`/api/payments/fee/${feeId}`);
  return response.data;
}
