import mongoose from "mongoose";

const foodItemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: String,
    category: String,
    quantity: String,
    storage: String,
    expiryDate: Date,
    notes: String,
    image: String,
    quantityKg: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["safe", "near", "expired", "consumed"],
    },
    label: String,
  },
  { timestamps: true }
);


export default mongoose.model("FoodItem", foodItemSchema);
