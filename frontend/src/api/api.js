import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export async function fetchUsers() {
  const res = await axios.get(`${API_BASE}/api/users`);
  return res.data;
}
