import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail
        pass: process.env.EMAIL_PASS, // App password
      },
    });

    await transporter.sendMail({
      from: '"Rajat Singh 👑" rajat.code14@gmail.com',
      to,
      subject,
      text,
    });

    console.log("✅ Email sent to", to);
  } catch (error) {
    console.error("❌ Email sending failed:", error);
  }
};
