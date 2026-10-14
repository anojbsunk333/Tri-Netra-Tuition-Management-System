import express from "express";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

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

router.get("/", authMiddleware, roleMiddleware(["admin", "teacher"]), listExams);

router.get("/student/:studentId", authMiddleware, getStudentResults);

router.get("/:id", authMiddleware, roleMiddleware(["admin", "teacher"]), getExam);

router.post("/", authMiddleware, roleMiddleware(["admin", "teacher"]), createExam);

router.post("/bulk", authMiddleware, roleMiddleware(["admin", "teacher"]), bulkCreateExams);

router.put("/:id", authMiddleware, roleMiddleware(["admin", "teacher"]), updateExam);

router.delete("/:id", authMiddleware, roleMiddleware(["admin", "teacher"]), deleteExam);

export default router;
