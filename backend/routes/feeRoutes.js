import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
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
router.get("/", authMiddleware, roleMiddleware("admin"), listFees);
router.get("/summary", authMiddleware, roleMiddleware("admin"), feeSummary);
router.get("/:id", authMiddleware, roleMiddleware("admin"), getFee);
router.post("/", authMiddleware, roleMiddleware("admin"), createFee);
router.post("/pay/:id", authMiddleware, roleMiddleware("admin"), recordPayment);
router.post(
  "/bulk-generate",
  authMiddleware,
  roleMiddleware("admin"),
  bulkGenerateFees,
);
router.put("/:id", authMiddleware, roleMiddleware("admin"), updateFee);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteFee);
export default router;
