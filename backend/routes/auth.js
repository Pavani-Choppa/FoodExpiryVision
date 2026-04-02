// import { sendEmail } from "../utils/sendEmail.js";

// router.post("/forgot-password", async (req, res) => {
//   try {
//     const { email } = req.body;

//     const resetLink = "https://your-frontend-url/reset-password";

//     await sendEmail(
//       email,
//       "Password Reset",
//       `Click here to reset your password: ${resetLink}`
//     );

//     res.json({ message: "Email sent successfully" });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to send email" });
//   }
//   console.log("EMAIL_USER:", process.env.EMAIL_USER);
//   console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded" : "Missing");
// });