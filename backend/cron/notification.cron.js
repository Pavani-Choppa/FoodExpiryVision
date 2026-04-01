import cron from "node-cron";
import FoodItem from "../models/FoodItem.model.js";
import Notification from "../models/Notification.model.js";

export const startNotificationCron = () => {
  // Runs EVERY DAY at 9 AM
  cron.schedule("0 9 * * *", async () => {
    console.log("🔔 Running notification cron...");

    const today = new Date();

    const items = await FoodItem.find({
      status: { $in: ["near", "expired"] },
    });

    for (const item of items) {
      const diff = Math.ceil(
        (new Date(item.expiryDate) - today) / (1000 * 60 * 60 * 24)
      );

      let type, title, message;

      if (diff < 0) {
        type = "expired";
        title = "Item Expired";
        message = `${item.name} expired ${Math.abs(diff)} day(s) ago`;
      } else if (diff <= 2) {
        type = "warning";
        title = "Expiring Soon";
        message = `${item.name} expires in ${diff} day(s)`;
      } else {
        continue;
      }

      // ❗ Avoid duplicate notifications
      const alreadyExists = await Notification.findOne({
        userId: item.userId,
        message,
      });

      if (!alreadyExists) {
        await Notification.create({
          userId: item.userId,
          type,
          title,
          message,
        });
      }
    }
  });
};
