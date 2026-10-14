import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import {
  listAnnouncements,
  getAnnouncement,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../controllers/announcementController.js";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  roleMiddleware(["admin", "teacher", "student"]),
  listAnnouncements,
);
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin", "teacher", "student"]),
  getAnnouncement,
);
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin", "teacher"]),
  createAnnouncement,
);
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin", "teacher"]),
  updateAnnouncement,
);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin", "teacher"]),
  deleteAnnouncement,
);

export default router;
