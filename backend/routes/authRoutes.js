import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  login,
  register,
  getMe,
  changePassword,
} from "../controllers/authController.js";

const router = express.Router();
router.post("/login", login);
router.post("/register", register);
router.get("/me", authMiddleware, getMe);
router.post("/change-password", authMiddleware, changePassword);
export default router;
