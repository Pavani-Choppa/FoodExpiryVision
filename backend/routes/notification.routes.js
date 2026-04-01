import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  getNotifications,
  markAllRead,
  markOneRead,getUnreadCount
} from "../controllers/notification.controller.js";



const router = express.Router();
router.get("/unread-count", authMiddleware, getUnreadCount);

router.get("/", authMiddleware, getNotifications);
router.patch("/mark-all-read", authMiddleware, markAllRead);
router.patch("/:id/read", authMiddleware, markOneRead);

export default router;
