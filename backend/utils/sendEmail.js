// import nodemailer from "nodemailer";

// export const sendEmail = async (to, subject, text) => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   await transporter.sendMail({
//     from: `"FoodExpiryVision" <${process.env.EMAIL_USER}>`,
//     to,
//     subject,
//     text,
//   });
// };  


import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to, subject, text) => {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: to,
    subject: subject,
    text: text,
  });
};