import express from "express";
import sendOtpHandler from "../controllers/sendOtpHandler.js";
import verifyOtpHandler from "../controllers/verifyOtpHandler.js";
import completeProfileHandler from "../controllers/completeProfileHandler.js";
import { protect } from "../middleware/protect.js";
import saveAddressHandler from "../controllers/saveAddressHandler.js";
import logoutUser from "../utils/logoutUser.js";
import adminLoginHandler from "../controllers/adminLoginHandler.js";

const router = express.Router();

router.post("/send-otp", sendOtpHandler);
router.post("/admin-login", adminLoginHandler);
router.post("/verify-otp", verifyOtpHandler);
router.post("/complete-profile", protect, completeProfileHandler);
router.post("/save-address", protect, saveAddressHandler);

router.get("/me", protect, (req, res) => {
  res.json(req.user);
});
router.get("/get-users", getUsersHandler);

router.post("/logout", logoutUser);

export default router;
