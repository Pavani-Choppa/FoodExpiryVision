import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import foodRoutes from "./routes/food.routes.js";
import activityRoutes from "./routes/activity.routes.js";
import authRoutes from "./routes/auth.routes.js";
import path from "path";
import analyticsRoutes from "./routes/analytics.routes.js";
import notificationRoutes from "./routes/notification.routes.js";





dotenv.config(); // MUST be before DB connection

import connectDB from "./config/db.js";
connectDB();



const app = express();

// app.use(cors({
//   origin: ["http://localhost:3000", "http://localhost:5173"],
//   credentials: true
// }));

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://food-expiry-vision.vercel.app"
  ],
  credentials: true
}));



app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/uploads", express.static("uploads"));

app.use("/api/food", foodRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/notifications", notificationRoutes);





// test route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

export default app; // 👈 THIS FIXES THE ERROR
