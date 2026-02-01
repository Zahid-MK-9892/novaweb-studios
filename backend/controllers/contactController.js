const Contact = require("../models/Contact");
const { Resend } = require("resend");
const twilio = require("twilio");

/* ===============================
   Initialize Services
================================ */
const resend = new Resend(process.env.RESEND_API_KEY);

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/* ===============================
   Controller
================================ */
exports.send = async (req, res) => {
  const { name, email, message } = req.body;

  // 🔒 Validation
  if (!name || !email || !message) {
    return res.status(400).json({
      ok: false,
      error: "All fields required"
    });
  }

  try {
    /* ===============================
       1️⃣ Save lead (CRITICAL)
    =============================== */
    await Contact.create({ name, email, message });

    // ✅ Respond immediately (DO NOT BLOCK USER)
    res.json({ ok: true });

    /* ===============================
       2️⃣ WhatsApp Admin Notification
       (NON-BLOCKING)
    =============================== */
    twilioClient.messages
      .create({
        from: process.env.TWILIO_WHATSAPP_FROM,
        to: process.env.TWILIO_WHATSAPP_TO,
        body: `🚀 New Lead - NovaWeb Studios

👤 Name: ${name}
📧 Email: ${email}

💬 Message:
${message}`
      })
      .then(() => console.log("✅ WhatsApp sent"))
      .catch(err => console.error("❌ WhatsApp failed:", err.message));

    /* ===============================
       3️⃣ Admin Email Notification
       (NON-BLOCKING)
    =============================== */
    resend.emails
      .send({
        from: "NovaWeb Studios <onboarding@resend.dev>",
        to: process.env.ADMIN_EMAIL,
        subject: "🚀 New Lead - NovaWeb Studios",
        html: `
          <h2>New Contact Form Submission</h2>
          <p><b>Name:</b> ${name}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Message:</b></p>
          <p>${message}</p>
        `
      })
      .then(() => console.log("✅ Admin email sent"))
      .catch(err => console.error("❌ Admin email failed:", err));

    /* ===============================
       4️⃣ Customer Auto-Reply Email
       (NON-BLOCKING)
    =============================== */
    resend.emails
      .send({
        from: "NovaWeb Studios <onboarding@resend.dev>",
        to: email,
        subject: "Thanks for contacting NovaWeb Studios 👋",
        html: `
          <p>Hi ${name},</p>
          <p>Thanks for reaching out to <b>NovaWeb Studios</b>.</p>
          <p>We’ve received your message and will get back to you shortly.</p>

          <p><b>Your message:</b></p>
          <blockquote>${message}</blockquote>

          <p>— NovaWeb Studios</p>
        `
      })
      .then(() => console.log("✅ Auto-reply sent"))
      .catch(err => console.error("❌ Auto-reply failed:", err));

  } catch (error) {
    console.error("❌ Contact controller fatal error:", error);
    res.status(500).json({ ok: false, error: "Server error" });
  }
};
