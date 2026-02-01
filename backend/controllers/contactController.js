const Contact = require("../models/Contact");
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

exports.send = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // 1️⃣ Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({ ok: false, error: "All fields required" });
    }

    // 2️⃣ Save to database
    await Contact.create({ name, email, message });

    // 3️⃣ SEND ADMIN EMAIL (LOG ERRORS)
    try {
      await resend.emails.send({
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
      });

      console.log("✅ Admin email sent successfully");
    } catch (emailError) {
      console.error("❌ Admin email failed:", emailError);
    }

    // 4️⃣ SEND AUTO-REPLY TO CUSTOMER (LOG ERRORS)
    try {
      await resend.emails.send({
        from: "NovaWeb Studios <onboarding@resend.dev>",
        to: email,
        subject: "Thanks for contacting NovaWeb Studios 👋",
        html: `
          <p>Hi ${name},</p>
          <p>Thanks for reaching out. We’ve received your message and will reply shortly.</p>
          <p><b>Your message:</b></p>
          <blockquote>${message}</blockquote>
          <p>— NovaWeb Studios</p>
        `
      });

      console.log("✅ Auto-reply email sent to customer");
    } catch (autoReplyError) {
      console.error("❌ Auto-reply email failed:", autoReplyError);
    }

    // 5️⃣ Final response to frontend
    res.json({ ok: true });

  } catch (error) {
    console.error("❌ Contact controller error:", error);
    res.status(500).json({ ok: false, error: "Server error" });
  }
};
