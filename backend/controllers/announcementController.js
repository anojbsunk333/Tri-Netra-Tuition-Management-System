import { randomUUID } from "crypto";
import {
  getCollection,
  createItem,
  updateItem,
  deleteItem,
} from "../utils/db.js";

const resource = "announcements";

export async function listAnnouncements(req, res) {
  const announcements = await getCollection(resource);
  res.json(announcements);
}

export async function getAnnouncement(req, res) {
  const announcements = await getCollection(resource);
  const announcement = announcements.find(
    (item) => String(item.id) === String(req.params.id),
  );
  if (!announcement)
    return res.status(404).json({ message: "Announcement not found" });
  res.json(announcement);
}

export async function createAnnouncement(req, res) {
  const { title, body, author, date, role } = req.body;
  if (!title || !body) {
    return res.status(400).json({ message: "Title and body are required" });
  }

  const newAnnouncement = {
    id: randomUUID(),
    title,
    body,
    author: author || "Admin",
    role: role || "admin",
    date: date || new Date().toISOString(),
  };

  await createItem(resource, newAnnouncement);
  res.status(201).json(newAnnouncement);
}

export async function updateAnnouncement(req, res) {
  const updatedAnnouncement = await updateItem(
    resource,
    req.params.id,
    req.body,
  );
  if (!updatedAnnouncement) {
    return res.status(404).json({ message: "Announcement not found" });
  }
  res.json(updatedAnnouncement);
}

export async function deleteAnnouncement(req, res) {
  const deleted = await deleteItem(resource, req.params.id);
  if (!deleted) {
    return res.status(404).json({ message: "Announcement not found" });
  }
  res.json({ success: true });
}
