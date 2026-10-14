import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

import {
  listAttendance,
  getAttendance,
  createAttendance,
  createAttendanceSession,
  scanAttendanceQr,
  attendanceReport,
  updateAttendance,
  deleteAttendance,
} from "../controllers/attendanceController.js";

const router = express.Router();

// =========================================================
// ATTENDANCE
// =========================================================

router.get(
  "/",
  authMiddleware,
  roleMiddleware(["admin", "teacher"]),
  listAttendance,
);

router.get(
  "/report",
  authMiddleware,
  roleMiddleware("admin"),
  attendanceReport,
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin", "teacher"]),
  getAttendance,
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin", "teacher"]),
  createAttendance,
);

// =========================================================
// QR ATTENDANCE
// =========================================================

router.post(
  "/qr-session",
  authMiddleware,
  roleMiddleware(["admin", "teacher"]),
  createAttendanceSession,
);

router.post(
  "/qr-scan",
  authMiddleware,
  roleMiddleware(["admin", "teacher"]),
  scanAttendanceQr,
);

// =========================================================
// UPDATE / DELETE
// =========================================================

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin", "teacher"]),
  updateAttendance,
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteAttendance,
);

export default router;
