import axios from "../api/axios";

export async function getAnnouncements() {
  const response = await axios.get("/api/announcements");
  return response.data;
}

export async function createAnnouncement(announcementData) {
  const response = await axios.post("/api/announcements", announcementData);
  return response.data;
}

export async function updateAnnouncement(id, announcementData) {
  const response = await axios.put(`/api/announcements/${id}`, announcementData);
  return response.data;
}

export async function deleteAnnouncement(id) {
  const response = await axios.delete(`/api/announcements/${id}`);
  return response.data;
}
