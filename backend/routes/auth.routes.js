import express from "express";
import { register,login } from "../controllers/auth.controller.js";
import { getMe ,  updateProfile } from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.model.js"; // your model
import { sendEmail } from "../utils/sendEmail.js";


const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, getMe);
router.put("/profile", authMiddleware, updateProfile);

// router.post("/reset-password", async (req, res) => {
//   try {
//     const { token, password } = req.body;

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const user = await User.findOne({ email: decoded.email });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     user.password = hashedPassword;
//     await user.save();

//     res.json({ message: "Password updated successfully" });

//   } catch (err) {
//     console.error(err);
//     res.status(400).json({ message: "Invalid or expired token" });
//   }
// });

router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded email:", decoded.email);

    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      console.log("User not found ❌");
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // user.password = hashedPassword;
    user.passwordHash = hashedPassword;

    await user.save();

    console.log("Password updated successfully ✅");

    res.json({ message: "Password updated successfully" });

  } catch (err) {
    console.error("RESET ERROR:", err);
    res.status(400).json({ message: "Invalid or expired token" });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    console.log("Sending email to:", email);

    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const resetLink = `http://localhost:5173/reset-password?token=${token}`;

    // const resetLink = "https://your-frontend-url/reset-password";
    // const resetLink = "http://localhost:5173/reset-password";
    // const resetLink = "http://localhost:5173/reset-password";

    await sendEmail(
      email,
      "Password Reset",
      `Click here to reset your password: ${resetLink}`
    );

    res.json({ message: "Email sent successfully" });

  } catch (err) {
    console.error("EMAIL ERROR:", err);
    res.status(500).json({ error: "Failed to send email" });
  }
});



export default router;
