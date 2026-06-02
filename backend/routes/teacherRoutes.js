import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import {
  listTeachers,
  getTeacher,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from "../controllers/teacherController.js";

const router = express.Router();
router.get("/", listTeachers);
router.get("/:id", getTeacher);
router.post("/", authMiddleware, roleMiddleware("admin"), createTeacher);
router.put("/:id", authMiddleware, roleMiddleware("admin"), updateTeacher);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteTeacher);
export default router;
