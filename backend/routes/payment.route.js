import express from "express";
import { protect, adminOnly } from "../middleware/protect.js";
import paymentHandler from "../controllers/paymentHandler.js";
import verifyPaymentHandler from "../controllers/verifyPaymentHandler.js";
import getMyOrdersHandler from "../controllers/getMyOrdersHandler.js";
import getAllOrdersHandler from "../controllers/getAllOrdersHandler.js";
import updateOrderStatusHandler from "../controllers/updateOrderStatusHandler.js";

const router = express.Router();

router.post("/", protect, paymentHandler);
router.post("/verify-payment", protect, verifyPaymentHandler);
router.get("/my-orders", protect, getMyOrdersHandler);
router.get("/all-orders", protect, adminOnly, getAllOrdersHandler);
router.patch(
  "/update-status/:id",
  protect,
  adminOnly,
  updateOrderStatusHandler,
);

export default router;
