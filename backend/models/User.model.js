import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    role: {
      type: String,
      default: "user"
    },
      // 🔔 Notification preferences
    emailNotifications: {
      type: Boolean,
      default: true,
    },
    pushNotifications: {
      type: Boolean,
      default: false,
    },
    dailySummary: {
      type: Boolean,
      default: true,
    },

    
    bio: String,
    phone: String,
    location: String,

    notificationSettings: {
    email: {
      type: Boolean,
      default: true,
    },
    push: {
      type: Boolean,
      default: false,
    },
    dailySummary: {
      type: Boolean,
      default: true,
    },
  }},
  { timestamps: true } 
);

export default mongoose.model("User", userSchema);
