import { submitContact } from "../api";

export default function Home() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    await submitContact({
      name: form.name.value,
      email: form.email.value,
      message: form.message.value,
    });

    alert("Message sent successfully!");
    form.reset();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>NovaWeb Studios</h1>
      <p>Professional Sites. Real Results.</p>

      {/* Navigation */}
      <a href="/portfolio">View Portfolio</a>
      <hr />

      <h3>Contact Us</h3>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" required /><br /><br />
        <input name="email" placeholder="Email" required /><br /><br />
        <textarea name="message" placeholder="Message" required /><br /><br />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
