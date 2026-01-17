const Contact = require("../models/Contact");
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

exports.send = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ ok: false, error: "All fields required" });
    }

    // Save to DB
    await Contact.create({ name, email, message });

    // Send email via Resend
    await resend.emails.send({
      from: "NovaWeb Studios <onboarding@resend.dev>",
      to: ["yourgmail@gmail.com"],   // <-- YOUR EMAIL HERE
      subject: "🚀 New Lead - NovaWeb Studios",
      html: `
        <h2>New Contact Form Submission</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b></p>
        <p>${message}</p>
      `
    });

    res.json({ ok: true });

  } catch (error) {
    console.error("Contact email error:", error);
    res.status(500).json({ ok: false, error: "Email failed" });
  }
};
