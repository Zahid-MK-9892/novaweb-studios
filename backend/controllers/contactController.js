const Contact = require("../models/Contact");
const nodemailer = require("nodemailer");

/**
 * Gmail SMTP transporter (Render-safe)
 * IMPORTANT:
 * - Uses smtp.gmail.com
 * - Uses port 465
 * - Uses secure SSL
 */
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // MUST be true for port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.send = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // ✅ Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({
        ok: false,
        error: "All fields are required"
      });
    }

    // 1️⃣ Save contact to MongoDB
    await Contact.create({ name, email, message });

    // 2️⃣ Send notification email
    await transporter.sendMail({
      from: `"NovaWeb Studios" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "🚀 New Lead - NovaWeb Studios",
      text: `
New Contact Form Submission

Name: ${name}
Email: ${email}

Message:
${message}
      `
    });

    // 3️⃣ Success response
    res.json({ ok: true });

  } catch (error) {
    console.error("Contact email error:", error);
    res.status(500).json({
      ok: false,
      error: "Email sending failed"
    });
  }
};
