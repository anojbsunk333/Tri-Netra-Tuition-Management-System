import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  studentReport,
  attendanceReport,
  feeReport,
  receiptPdf,
} from "../controllers/reportController.js";

const router = express.Router();
router.get("/student/:studentId", authMiddleware, studentReport);
router.get("/attendance", authMiddleware, attendanceReport);
router.get("/fees", authMiddleware, feeReport);
router.get("/receipt/:feeId", authMiddleware, receiptPdf);

export default router;
