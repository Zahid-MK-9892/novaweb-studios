const Contact = require("../models/Contact");

// 🔹 WhatsApp (Twilio)
const twilio = require("twilio");
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// 🔹 Email (Resend)
const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

exports.send = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ ok: false, error: "All fields required" });
  }

  try {
    /* ===============================
       1️⃣ Save lead to database
    =============================== */
    await Contact.create({ name, email, message });

    /* ===============================
       2️⃣ WhatsApp Admin Notification
    =============================== */
    twilioClient.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: process.env.TWILIO_WHATSAPP_TO,
      body: `🚀 New Lead - NovaWeb Studios

👤 Name: ${name}
📧 Email: ${email}

💬 Message:
${message}`
    }).catch(err => {
      console.error("WhatsApp failed:", err.message);
    });

    /* ===============================
       3️⃣ Admin Email Notification
    =============================== */
    resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: "🚀 New Lead - NovaWeb Studios",
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    }).catch(err => {
      console.error("Admin email failed:", err.message);
    });

    /* ===============================
       4️⃣ Customer Auto-Reply Email
    =============================== */
    resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Thanks for contacting NovaWeb Studios 👋",
      html: `
        <p>Hi ${name},</p>
        <p>Thank you for reaching out to <strong>NovaWeb Studios</strong>.</p>
        <p>We’ve received your message and will get back to you shortly.</p>

        <p><strong>Your message:</strong></p>
        <blockquote>${message}</blockquote>

        <p>Regards,<br/>
        NovaWeb Studios Team</p>
      `
    }).catch(err => {
      console.error("Auto-reply failed:", err.message);
    });

    /* ===============================
       5️⃣ Respond immediately
    =============================== */
    res.json({ ok: true });

  } catch (error) {
    console.error("Contact controller error:", error);
    res.status(500).json({ ok: false });
  }
};
