import express from "express";
import getUsersHandler from "../controllers/getUsersHandler.js";
// import { protect, adminOnly } from "../middleware/protect.js";

const router = express.Router();

router.get("/get-users", getUsersHandler);

export default router;
