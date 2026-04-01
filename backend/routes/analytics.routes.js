import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { getWasteReduction } from "../controllers/analytics.controller.js";
import { getAnalytics } from "../controllers/analytics.controller.js";
const router = express.Router();

router.get("/waste-reduction", authMiddleware, getWasteReduction);
router.get("/", authMiddleware, getAnalytics);

export default router;
