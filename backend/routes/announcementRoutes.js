import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  listAnnouncements,
  getAnnouncement,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../controllers/announcementController.js";

const router = express.Router();
router.get("/", listAnnouncements);
router.get("/:id", getAnnouncement);
router.post("/", authMiddleware, createAnnouncement);
router.put("/:id", authMiddleware, updateAnnouncement);
router.delete("/:id", authMiddleware, deleteAnnouncement);
export default router;
