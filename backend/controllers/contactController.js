const Contact = require("../models/Contact");
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

exports.send = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({
        ok: false,
        error: "All fields are required"
      });
    }

    // 1️⃣ Save lead to MongoDB
    await Contact.create({ name, email, message });

    // 2️⃣ Email to YOU (Admin notification)
    await resend.emails.send({
      from: "NovaWeb Studios <onboarding@resend.dev>",
      to: ["zahid.k.916717@gmail.com"], // 🔴 REPLACE with your admin email
      subject: "🚀 New Lead - NovaWeb Studios",
      html: `
        <h2>New Contact Form Submission</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b></p>
        <p>${message}</p>
      `
    });

    // 3️⃣ Auto-reply email to CUSTOMER
    await resend.emails.send({
      from: "NovaWeb Studios <onboarding@resend.dev>",
      to: [email],
      subject: "Thanks for contacting NovaWeb Studios!",
      html: `
        <p>Hi ${name},</p>

        <p>Thank you for reaching out to <b>NovaWeb Studios</b>.</p>

        <p>We’ve received your message and will get back to you within
        <b>24 hours</b>.</p>

        <p><b>Your message:</b></p>
        <blockquote>${message}</blockquote>

        <p>In the meantime, feel free to reply to this email if you have
        additional details.</p>

        <p>Best regards,<br/>
        <b>NovaWeb Studios</b><br/>
        Professional Sites. Real Results.</p>
      `
    });

    // 4️⃣ Success response
    res.json({ ok: true });

  } catch (error) {
    console.error("Contact email error:", error);
    res.status(500).json({
      ok: false,
      error: "Email sending failed"
    });
  }
};
