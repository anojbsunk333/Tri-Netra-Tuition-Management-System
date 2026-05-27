import express from "express";
import { listFees } from "../controllers/feeController.js";

const router = express.Router();
router.get("/", listFees);
export default router;
