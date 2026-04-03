import express from "express";
import { upload } from "../middleware/upload.js";
import { uploadCloudinary } from "../middleware/uploadCloudinary.js";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  addFoodItem,
  getFoodItems,
  updateFoodItem,
  markFoodConsumed,
  deleteFoodItem,
} from "../controllers/foodItem.controller.js";
import multer from "multer";
import { scanFood } from "../controllers/foodItem.controller.js";


// const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.post("/", authMiddleware, upload.single("image"), addFoodItem);
router.get("/", authMiddleware, getFoodItems);
router.put("/:id", authMiddleware, upload.single("image"), updateFoodItem);
router.patch("/:id/consume", authMiddleware, markFoodConsumed);
router.delete("/:id", authMiddleware, deleteFoodItem);
router.post("/scan", upload.single("image"), scanFood);
router.post("/", authMiddleware, uploadCloudinary.single("image"), addFoodItem);
router.put("/:id", authMiddleware, uploadCloudinary.single("image"), updateFoodItem);

export default router;
