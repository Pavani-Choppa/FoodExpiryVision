import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { updateNotificationSettings } from "../controllers/user.controller.js";

const router = express.Router();

router.put("/notification-settings", authMiddleware, updateNotificationSettings);

export default router;
