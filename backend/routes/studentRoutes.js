import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import {
  listStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../controllers/studentController.js";

const router = express.Router();
router.get("/", listStudents);
router.get("/:id", getStudent);
router.post("/", authMiddleware, roleMiddleware("admin"), createStudent);
router.put("/:id", authMiddleware, roleMiddleware("admin"), updateStudent);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteStudent);
export default router;
