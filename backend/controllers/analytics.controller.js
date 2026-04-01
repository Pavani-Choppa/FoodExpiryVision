import mongoose from "mongoose";

import Activity from "../models/Activity.model.js";
import FoodItem from "../models/FoodItem.model.js";



export const getWasteReduction = async (req, res) => {
  try {
    const userId = req.userId;

    const startOfThisMonth = new Date();
    startOfThisMonth.setDate(1);

    const startOfLastMonth = new Date();
    startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);
    startOfLastMonth.setDate(1);

    const lastMonthWaste = await Activity.countDocuments({
      userId,
      action: { $in: ["deleted", "wasted"] },
      createdAt: { $gte: startOfLastMonth, $lt: startOfThisMonth },
    });

    const thisMonthWaste = await Activity.countDocuments({
      userId,
      action: { $in: ["deleted", "wasted"] },
      createdAt: { $gte: startOfThisMonth },
    });

    let reduction = 0;
    if (lastMonthWaste > 0) {
      reduction =
        ((lastMonthWaste - thisMonthWaste) / lastMonthWaste) * 100;
    }

    res.json({
      summary: {
        lastMonthWaste,
        thisMonthWaste,
        reduction: Math.max(0, Math.round(reduction)),
      },
      trend: [
        { month: "Last Month", value: lastMonthWaste },
        { month: "This Month", value: thisMonthWaste },
      ],
    });
  } catch (err) {
    console.error("Waste reduction error:", err);
    res.status(500).json({ message: "Failed to calculate waste reduction" });
  }
};




export const getAnalytics = async (req, res) => {
  try {
    const userId = req.userId;
    const userObjectId = new mongoose.Types.ObjectId(req.userId);

    // ===============================
    // TOP STATS
    // ===============================
    const totalConsumed = await Activity.countDocuments({
      userId,
      action: "consumed",
      
    });

    const consumedBeforeExpiry = await Activity.countDocuments({
      userId,
      action: "consumed",
      wasExpired: false,
    });

    // ===============================
    // SAVED FOOD (KG + ₹)
    // ===============================

    // find food items that were consumed (and not expired)
    // const savedFoods = await FoodItem.find({
    //   userId: userObjectId,
    //   status: "consumed",
    // });

    // total saved kg
    // ✅ TEMP FIX: extract kg from "quantity" string like "2 kg", "1.5kg"
    // const savedKg = savedFoods.reduce((sum, item) => {
    //   const match = item.quantity?.match(/[\d.]+/);
    //   return sum + (match ? Number(match[0]) : 0);
    // }, 0);


    // ===============================
    // SAVED MONEY (₹ per item)
    // ===============================

    const PRICE_PER_ITEM = 60;

    // each consumed item = ₹60 saved
    const savedAmount = totalConsumed * PRICE_PER_ITEM;



    const totalWasted = await Activity.countDocuments({
      userId,
      action: { $in: ["wasted", "deleted"] },
    });

    const totalAdded = await Activity.countDocuments({
      userId,
      action: "added",
    });

    const efficiencyRate =
      totalAdded > 0
        ? Number(((totalConsumed / totalAdded) * 100).toFixed(1))
        : 0;

    // ===============================
    // MONTHLY BAR CHART
    // ===============================
    const monthly = await Activity.aggregate([
      { $match: { userId: userObjectId } },


      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            action: "$action",
          },
          count: { $sum: 1 },
        },
      },
    ]);


    // const pieData = await FoodItem.aggregate([
    //   { $match: { userId: userObjectId } },

    //   {
    //     $group: {
    //       _id: "$category",
    //       value: { $sum: 1 },
    //     },
    //   },
    //   {
    //     $project: {
    //       name: "$_id",
    //       value: 1,
    //       _id: 0,
    //     },
    //   },
    // ]);


    const barData = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
      .map((m, i) => {
        const consumed = monthly.find(
          x => x._id.month === i + 1 && x._id.action === "consumed"
        )?.count || 0;

        const wasted =
          (monthly.find(x => x._id.month === i + 1 && x._id.action === "deleted")?.count || 0) +
          (monthly.find(x => x._id.month === i + 1 && x._id.action === "wasted")?.count || 0);

        console.log("MONTHLY RAW 👉", monthly);

        return { month: m, consumed, wasted };
      });

    // ===============================
    // CATEGORY DISTRIBUTION
    // ===============================
    const categoryData = await FoodItem.aggregate([
      { $match: { userId: userObjectId } },

      {
        $group: {
          _id: "$category",
          value: { $sum: 1 },
        },
      },
      {
        $project: {
          name: "$_id",
          value: 1,
          _id: 0,
        },
      },
    ]);

    // ===============================
    // WEEKLY STATUS
    // ===============================
    const weeklyStatus = await FoodItem.aggregate([
      { $match: { userId: userObjectId } },

      {
        $addFields: {
          week: {
            $dateToString: { format: "%Y-%U", date: "$createdAt" },
          },
        },
      },
      {
        $group: {
          _id: "$week",
          safe: {
            $sum: { $cond: [{ $eq: ["$status", "safe"] }, 1, 0] },
          },
          near: {
            $sum: { $cond: [{ $eq: ["$status", "near"] }, 1, 0] },
          },
          expired: {
            $sum: { $cond: [{ $eq: ["$status", "expired"] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          week: "$_id",
          safe: 1,
          near: 1,
          expired: 1,
          _id: 0,
        },
      },
      { $sort: { week: 1 } },
      { $limit: 4 },
    ]);


    // ===============================
    // RESPONSE
    // ===============================
     
    res.json({
      stats: {
        totalConsumed,
        totalWasted,
        efficiencyRate,
        savedAmount,
      },
      barData,
      pieData: categoryData,
      weeklyData: weeklyStatus,
    });



  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ message: "Analytics failed" });
  }
};
