import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import {
  listStudents,
  getMyStudentOverview,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../controllers/studentController.js";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  roleMiddleware(["admin", "teacher"]),
  listStudents,
);
router.get("/me/overview", authMiddleware, getMyStudentOverview);
router.get("/:id", authMiddleware, getStudent);

router.post("/", authMiddleware, roleMiddleware("admin"), createStudent);
router.put("/:id", authMiddleware, roleMiddleware("admin"), updateStudent);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteStudent);

export default router;
