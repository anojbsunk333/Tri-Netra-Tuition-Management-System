import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
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
router.get("/", listAttendance);
router.get("/report", authMiddleware, attendanceReport);
router.get("/:id", getAttendance);
router.post("/", authMiddleware, createAttendance);
router.post("/qr-session", authMiddleware, createAttendanceSession);
router.post("/qr-scan", authMiddleware, scanAttendanceQr);
router.put("/:id", authMiddleware, updateAttendance);
router.delete("/:id", authMiddleware, deleteAttendance);
export default router;
