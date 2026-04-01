import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    itemName: String,
    action: {
      type: String,
      enum: ["added", "consumed", "deleted", "wasted"],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Activity", activitySchema);
