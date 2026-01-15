import { useState } from "react";
import { addPortfolio } from "../api";

export default function AdminDashboard() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    await addPortfolio(
      { title, category, description },
      token
    );

    alert("Portfolio item added");

    setTitle("");
    setCategory("");
    setDescription("");
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button type="submit">Add Portfolio</button>
      </form>
    </div>
  );
}
