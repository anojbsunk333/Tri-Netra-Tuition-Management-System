import express from "express";
import { listExams } from "../controllers/examController.js";

const router = express.Router();
router.get("/", listExams);
export default router;
