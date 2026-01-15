import { useState } from "react";
import { getToken, logout } from "../utils/auth";

export default function AdminDashboard() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  const handleAdd = async (e) => {
    e.preventDefault();
    setMessage("");

    const token = getToken();
    if (!token) {
      setMessage("Not authenticated");
      return;
    }

    const res = await fetch("http://localhost:5000/api/portfolio", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ title, category, description }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.message || "Error adding portfolio");
      return;
    }

    setMessage("Portfolio item added successfully!");
    setTitle("");
    setCategory("");
    setDescription("");
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Admin Dashboard</h2>

      <button onClick={() => { logout(); window.location.href = "/admin/login"; }}>
        Logout
      </button>

      <h3>Add Portfolio</h3>
      {message && <p>{message}</p>}

      <form onSubmit={handleAdd}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        /><br /><br />

        <input
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        /><br /><br />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        /><br /><br />

        <button type="submit">Add Portfolio</button>
      </form>
    </div>
  );
}
