import express from "express";

import {
  listPayments,
  getPayment,
  getPaymentsByFee,
} from "../controllers/paymentController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, roleMiddleware("admin"), listPayments);

router.get("/fee/:feeId", authMiddleware, getPaymentsByFee);

router.get("/:id", authMiddleware, getPayment);

export default router;
