import axios from "../api/axios";

export async function getMyStudentOverview() {
  const response = await axios.get("/api/students/me/overview");
  return response.data;
}

export async function updateMyProfile(profile) {
  const response = await axios.put("/api/auth/profile", profile);
  return response.data.user;
}

export async function changeMyPassword(oldPassword, newPassword) {
  const response = await axios.post("/api/auth/change-password", {
    oldPassword,
    newPassword,
  });
  return response.data;
}

export async function downloadReceipt(feeId) {
  const response = await axios.get(`/api/reports/receipt/${feeId}`, { responseType: "blob" });
  const url = URL.createObjectURL(response.data);
  const link = document.createElement("a");
  link.href = url;
  link.download = `fee-receipt-${feeId}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
}
