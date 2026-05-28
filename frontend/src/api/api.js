import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export async function fetchUsers() {
  const res = await axios.get(`${API_BASE}/api/users`);
  return res.data;
}

export async function registerUser(name, email, password, role) {
  const res = await axios.post(`${API_BASE}/api/auth/register`, {
    name,
    email,
    password,
    role,
  });
  return res.data;
}

export async function loginUser(email, password) {
  const res = await axios.post(`${API_BASE}/api/auth/login`, {
    email,
    password,
  });
  return res.data;
}
