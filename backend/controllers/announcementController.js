import { randomUUID } from "crypto";
import {
  getCollection,
  createItem,
  updateItem,
  deleteItem,
} from "../utils/db.js";

const resource = "announcements";

function normalizeAnnouncement(record = {}) {
  const bodyText = record.body ?? record.message ?? "";
  const authorName = record.author ?? record.postedBy ?? "System";
  const timestamp = record.date ?? record.createdAt ?? new Date().toISOString();

  return {
    ...record,
    title: record.title ?? "",
    body: bodyText,
    message: record.message ?? bodyText,
    author: authorName,
    postedBy: record.postedBy ?? authorName,
    role: record.role ?? "admin",
    date: timestamp,
    createdAt: record.createdAt ?? timestamp,
    authorId: record.authorId ?? null,
  };
}

function sanitizeAnnouncementContent(input = {}) {
  const { title, body, message } = input;
  const content = body ?? message;

  if (!title || !String(title).trim()) {
    return null;
  }

  if (!content || !String(content).trim()) {
    return null;
  }

  return {
    title: String(title).trim(),
    body: String(content).trim(),
  };
}

function canTeacherEditAnnouncement(reqUser, announcement) {
  if (!reqUser || reqUser.role !== "teacher") return false;
  if (announcement && announcement.authorId) {
    return String(announcement.authorId) === String(reqUser.id);
  }
  return false;
}

export async function listAnnouncements(req, res) {
  try {
    const announcements = await getCollection(resource);
    res.json(
      announcements.map((announcement) => normalizeAnnouncement(announcement)),
    );
  } catch (error) {
    console.error("List announcements error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to load announcements",
    });
  }
}

export async function getAnnouncement(req, res) {
  try {
    const announcements = await getCollection(resource);
    const announcement = announcements.find(
      (item) => String(item.id) === String(req.params.id),
    );

    if (!announcement) {
      return res
        .status(404)
        .json({ success: false, message: "Announcement not found" });
    }

    res.json(normalizeAnnouncement(announcement));
  } catch (error) {
    console.error("Get announcement error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to load announcement",
    });
  }
}

export async function createAnnouncement(req, res) {
  try {
    const content = sanitizeAnnouncementContent(req.body);

    if (!content) {
      return res.status(400).json({
        success: false,
        message: "Title and body are required",
      });
    }

    const creator = req.user || {};
    const timestamp = new Date().toISOString();

    const newAnnouncement = {
      id: randomUUID(),
      title: content.title,
      body: content.body,
      message: content.body,
      author: creator.name || "Admin",
      postedBy: creator.name || "Admin",
      role: String(creator.role || "admin").toLowerCase(),
      authorId: creator.id || null,
      date: timestamp,
      createdAt: timestamp,
    };

    await createItem(resource, newAnnouncement);
    res.status(201).json(normalizeAnnouncement(newAnnouncement));
  } catch (error) {
    console.error("Create announcement error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to create announcement",
    });
  }
}

export async function updateAnnouncement(req, res) {
  try {
    const announcements = await getCollection(resource);
    const existingAnnouncement = announcements.find(
      (item) => String(item.id) === String(req.params.id),
    );

    if (!existingAnnouncement) {
      return res
        .status(404)
        .json({ success: false, message: "Announcement not found" });
    }

    if (req.user.role === "admin") {
      const updates = sanitizeAnnouncementContent(req.body);
      if (!updates) {
        return res.status(400).json({
          success: false,
          message: "Title and body are required",
        });
      }

      const updatedAnnouncement = await updateItem(resource, req.params.id, {
        title: updates.title,
        body: updates.body,
        message: updates.body,
      });

      return res.json(normalizeAnnouncement(updatedAnnouncement));
    }

    if (req.user.role === "teacher") {
      if (!canTeacherEditAnnouncement(req.user, existingAnnouncement)) {
        return res.status(403).json({ success: false, message: "Forbidden" });
      }

      const updates = sanitizeAnnouncementContent(req.body);
      if (!updates) {
        return res.status(400).json({
          success: false,
          message: "Title and body are required",
        });
      }

      const updatedAnnouncement = await updateItem(resource, req.params.id, {
        title: updates.title,
        body: updates.body,
        message: updates.body,
      });

      return res.json(normalizeAnnouncement(updatedAnnouncement));
    }

    return res.status(403).json({ success: false, message: "Forbidden" });
  } catch (error) {
    console.error("Update announcement error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to update announcement",
    });
  }
}

export async function deleteAnnouncement(req, res) {
  try {
    const announcements = await getCollection(resource);
    const announcement = announcements.find(
      (item) => String(item.id) === String(req.params.id),
    );

    if (!announcement) {
      return res
        .status(404)
        .json({ success: false, message: "Announcement not found" });
    }

    if (req.user.role === "admin") {
      const deleted = await deleteItem(resource, req.params.id);
      if (!deleted) {
        return res
          .status(404)
          .json({ success: false, message: "Announcement not found" });
      }
      return res.json({
        success: true,
        message: "Announcement deleted successfully",
      });
    }

    if (req.user.role === "teacher") {
      if (!canTeacherEditAnnouncement(req.user, announcement)) {
        return res.status(403).json({ success: false, message: "Forbidden" });
      }

      const deleted = await deleteItem(resource, req.params.id);
      if (!deleted) {
        return res
          .status(404)
          .json({ success: false, message: "Announcement not found" });
      }

      return res.json({
        success: true,
        message: "Announcement deleted successfully",
      });
    }

    return res.status(403).json({ success: false, message: "Forbidden" });
  } catch (error) {
    console.error("Delete announcement error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to delete announcement",
    });
  }
}
