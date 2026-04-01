import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String, // expired | warning | info
      required: true,
    },
    title: String,
    message: String,
    read: {
      type: Boolean,
      default: false,
    },
    foodItemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FoodItem",
    },

  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
