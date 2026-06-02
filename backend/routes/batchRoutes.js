import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import {
  listBatches,
  getBatch,
  createBatch,
  updateBatch,
  deleteBatch,
} from "../controllers/batchController.js";

const router = express.Router();
router.get("/", listBatches);
router.get("/:id", getBatch);
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin", "teacher"]),
  createBatch,
);
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin", "teacher"]),
  updateBatch,
);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteBatch);
export default router;
