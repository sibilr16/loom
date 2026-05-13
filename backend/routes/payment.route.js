import express from "express";
import { protect } from "../middleware/protect.js";
import paymentHandler from "../controllers/paymentHandler.js";
import verifyPaymentHandler from "../controllers/verifyPaymentHandler.js";
const router = express.Router();

router.post("/", protect, paymentHandler);
router.post("/verify-payment", protect, verifyPaymentHandler);

export default router;
