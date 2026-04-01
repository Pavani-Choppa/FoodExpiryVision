import FoodItem from "../models/FoodItem.model.js";
import Activity from "../models/Activity.model.js";
import * as aiService from "../services/ai.service.js";



const getStatusFromDate = (date) => {
  const today = new Date();
  const expiry = new Date(date);
  const diff = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

  if (diff < 0) return "expired";
  if (diff <= 3) return "near";
  return "safe";
};

const getExpiryLabel = (date) => {
  const today = new Date();
  const expiry = new Date(date);
  const diff = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

  if (diff < 0) return `${Math.abs(diff)}d overdue`;
  return `${diff} days left`;
};

// ➕ Add Food Item
export const addFoodItem = async (req, res) => {
  try {
    const {
      name,
      category,
      quantity,
      storage,
      expiryDate,
      notes,
    } = req.body;

    const food = await FoodItem.create({
      userId: req.userId,
      name,
      category,
      quantity,
      storage,
      expiryDate,
      notes,
      image: req.file ? `/uploads/${req.file.filename}` : null,
      status: getStatusFromDate(expiryDate),
      label: getExpiryLabel(expiryDate),
    });

    // ✅ LOG ACTIVITY
    await Activity.create({
      userId: req.userId,
      itemName: food.name,
      action: "added",
    });

    res.status(201).json(food);
  } catch (error) {
    console.error("ADD FOOD ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};




// 📄 Get All Food Items (User specific)
export const getFoodItems = async (req, res) => {
    const foods = await FoodItem.find({
      userId: req.userId,
      status: { $ne: "consumed" },
    });


  const enriched = foods.map(item => ({
    ...item._doc,
    status: getStatusFromDate(item.expiryDate),
    label: getExpiryLabel(item.expiryDate),
  }));

  res.json(enriched);
};


// ✏️ Update Food Item
export const updateFoodItem = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      status: getStatusFromDate(req.body.expiryDate),
      label: getExpiryLabel(req.body.expiryDate),
    };

    // ✅ THIS IS THE MISSING PART
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const food = await FoodItem.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      updateData,
      { new: true }
    );

    if (!food) {
      return res.status(404).json({ message: "Food item not found" });
    }

    res.json(food);
  } catch (error) {
    console.error("UPDATE FOOD ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Consumed Food Item
export const markFoodConsumed = async (req, res) => {
  try {
    const food = await FoodItem.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      {
        status: "consumed",
        consumedAt: new Date(),
      },
      { new: true }
    );

    if (!food) {
      return res.status(404).json({ message: "Food item not found" });
    }

    // ✅ LOG ACTIVITY
    await Activity.create({
      userId: req.userId,
      itemName: food.name,
      action: "consumed",
    });

    res.json(food);
  } catch (error) {
    console.error("CONSUME FOOD ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};




// ❌ Delete Food Item
export const deleteFoodItem = async (req, res) => {
  try {
    const food = await FoodItem.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!food) {
      return res.status(404).json({ message: "Food item not found" });
    }

    // ✅ LOG ACTIVITY
    await Activity.create({
      userId: req.userId,
      itemName: food.name,
      action: "deleted",
    });

    res.json({ message: "Food item deleted" });
  } catch (error) {
    console.error("DELETE FOOD ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// const aiService = require("../services/ai.service");
// ✅ CORRECT

// const result = await aiService.analyzeImage(req.file.path);

// console.log(result);
export const scanFood = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const imagePath = req.file.path;

    // 🔥 CALL AI SERVICE
    const result = await aiService.analyzeImage(imagePath);

    return res.json({
      success: true,
      freshness_score: result.freshness_score,
      label: result.label,
    });

  } catch (error) {
    console.error("SCAN ERROR:", error);
    res.status(500).json({ message: "AI scan failed" });
  }
};