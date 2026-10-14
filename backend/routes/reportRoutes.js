import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import {
  studentReport,
  attendanceReport,
  feeReport,
  receiptPdf,
} from "../controllers/reportController.js";

const router = express.Router();
router.get("/student/:studentId", authMiddleware, studentReport);
router.get(
  "/attendance",
  authMiddleware,
  roleMiddleware("admin"),
  attendanceReport,
);
router.get("/fees", authMiddleware, roleMiddleware("admin"), feeReport);
router.get("/receipt/:feeId", authMiddleware, receiptPdf);

export default router;
