const Contact = require("../models/Contact");
const nodemailer = require("nodemailer");

exports.send = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // ✅ Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({ ok: false, error: "All fields required" });
    }

    // 1️⃣ Save contact to database
    await Contact.create({ name, email, message });

    // 2️⃣ Create email transporter (Render-safe)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // 3️⃣ Send notification email
    await transporter.sendMail({
      from: `"NovaWeb Studios" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "🚀 New Lead - NovaWeb Studios",
      text: `
New contact form submission:

Name: ${name}
Email: ${email}

Message:
${message}
      `
    });

    // 4️⃣ Respond success
    res.json({ ok: true });

  } catch (error) {
    console.error("Contact email error:", error);
    res.status(500).json({ ok: false, error: "Email failed" });
  }
};
