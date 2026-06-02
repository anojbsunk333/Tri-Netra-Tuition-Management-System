import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  listExams,
  getExam,
  createExam,
  bulkCreateExams,
  getStudentResults,
  updateExam,
  deleteExam,
} from "../controllers/examController.js";

const router = express.Router();
router.get("/", listExams);
router.get("/student/:studentId", authMiddleware, getStudentResults);
router.get("/:id", getExam);
router.post("/", authMiddleware, createExam);
router.post("/bulk", authMiddleware, bulkCreateExams);
router.put("/:id", authMiddleware, updateExam);
router.delete("/:id", authMiddleware, deleteExam);
export default router;
