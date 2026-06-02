import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  listFees,
  getFee,
  createFee,
  recordPayment,
  bulkGenerateFees,
  feeSummary,
  updateFee,
  deleteFee,
} from "../controllers/feeController.js";

const router = express.Router();
router.get("/", listFees);
router.get("/summary", authMiddleware, feeSummary);
router.get("/:id", getFee);
router.post("/", authMiddleware, createFee);
router.post("/pay/:id", authMiddleware, recordPayment);
router.post("/bulk-generate", authMiddleware, bulkGenerateFees);
router.put("/:id", authMiddleware, updateFee);
router.delete("/:id", authMiddleware, deleteFee);
export default router;
