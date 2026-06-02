import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export async function getAnnouncements() {
  const response = await axios.get(`${API_BASE}/api/announcements`);
  return response.data;
}

export async function createAnnouncement(announcementData) {
  const response = await axios.post(
    `${API_BASE}/api/announcements`,
    announcementData,
  );
  return response.data;
}

export async function updateAnnouncement(id, announcementData) {
  const response = await axios.put(
    `${API_BASE}/api/announcements/${id}`,
    announcementData,
  );
  return response.data;
}

export async function deleteAnnouncement(id) {
  const response = await axios.delete(`${API_BASE}/api/announcements/${id}`);
  return response.data;
}
