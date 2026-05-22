import express from "express";
import getUsersHandler from "../controllers/getUserHandler.js";
import getDashboardStats from "../controllers/getDashboardStats.js";
// import { protect, adminOnly } from "../middleware/protect.js";

const router = express.Router();

router.get("/get-users", getUsersHandler);
router.get("/dashboard-stats", getDashboardStats);

export default router;
