import FoodItem from "../models/FoodItem.model.js";
import Notification from "../models/Notification.model.js";

/* ===============================
   UNREAD COUNT
   =============================== */
export const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      userId: req.userId,
      read: false,
    });

    return res.json({ unreadCount: count });
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch unread count" });
  }
};

/* ===============================
   GENERATE NOTIFICATIONS
   =============================== */
export const generateNotifications = async (userId) => {
  const today = new Date();
  const foods = await FoodItem.find({ userId });

  for (const item of foods) {
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

    // 🔒 prevent duplicate notifications
    const exists = await Notification.findOne({
      userId,
      foodItemId: item._id,
      type,
    });

    if (!exists) {
      await Notification.create({
        userId,
        foodItemId: item._id,
        type,
        title,
        message,
      });
    }
    

  }
};

/* ===============================
   GET NOTIFICATIONS
   =============================== */
export const getNotifications = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await generateNotifications(req.userId);

    const notifications = await Notification.find({
      userId: req.userId,
    }).sort({ createdAt: -1 });

    return res.json(notifications);
  } catch (error) {
    console.error("❌ getNotifications error:", error);
    return res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

/* ===============================
   MARK ALL READ
   =============================== */
export const markAllRead = async (req, res) => {
  await Notification.updateMany(
    { userId: req.userId, read: false },
    { $set: { read: true } }
  );
  return res.json({ success: true });
};

/* ===============================
   MARK ONE READ
   =============================== */
export const markOneRead = async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, {
    read: true,
  });
  return res.json({ success: true });
};
