import User from "../models/User.model.js";

export const updateNotificationSettings = async (req, res) => {
  const userId = req.userId;
  const { emailNotifications, pushNotifications, dailySummary } = req.body;

  const user = await User.findByIdAndUpdate(
    userId,
    {
      emailNotifications,
      pushNotifications,
      dailySummary,
    },
    { new: true }
  );

  res.json(user);
};
