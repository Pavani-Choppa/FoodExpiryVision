import express from "express";
import { register,login } from "../controllers/auth.controller.js";
import { getMe ,  updateProfile } from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, getMe);
router.put("/profile", authMiddleware, updateProfile);

import { sendEmail } from "../utils/sendEmail.js";

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    console.log("Sending email to:", email);

    // const resetLink = "https://your-frontend-url/reset-password";
    const resetLink = "http://localhost:5173/reset-password";
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
