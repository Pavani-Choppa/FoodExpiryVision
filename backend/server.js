import app from "./app.js";
import path from "path";
import express from "express";
import { startNotificationCron } from "./cron/notification.cron.js";
import userRoutes from "./routes/user.routes.js";


app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api/user", userRoutes);

startNotificationCron();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
