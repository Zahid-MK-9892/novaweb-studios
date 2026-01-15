import { useEffect, useState } from "react";

export default function Portfolio() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/portfolio")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched portfolio:", data);
        setItems(data);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Our Work</h2>

      {items.length === 0 && <p>No projects yet.</p>}

      {items.map((item) => (
        <div
          key={item._id}
          style={{
            border: "1px solid #ccc",
            padding: 10,
            marginBottom: 10,
          }}
        >
          <h3>{item.title}</h3>
          <strong>Category: {item.category}</strong>
          <p>{item.description}</p>
        </div>
      ))}
    </div>
  );
}
