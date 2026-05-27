import express from "express";
import { listBatches } from "../controllers/batchController.js";

const router = express.Router();
router.get("/", listBatches);
export default router;
