import axios from "../api/axios.js";

export async function login(email, password) {
  const response = await axios.post("/api/auth/login", { email, password });
  return response.data;
}

export async function register(name, email, password, role) {
  const response = await axios.post("/api/auth/register", {
    name,
    email,
    password,
    role,
  });
  return response.data;
}

export async function getMe() {
  const response = await axios.get("/api/auth/me");
  return response.data;
}

export async function changePassword(oldPassword, newPassword) {
  const response = await axios.post("/api/auth/change-password", {
    oldPassword,
    newPassword,
  });
  return response.data;
}
