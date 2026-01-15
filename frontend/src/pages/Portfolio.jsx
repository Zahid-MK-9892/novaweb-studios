import { useEffect, useState } from "react";
import { getPortfolio } from "../api";

export default function Portfolio() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getPortfolio().then(setItems);
  }, []);

  return (
    <div>
      <h1>Portfolio</h1>

      {items.map((item) => (
        <div key={item._id}>
          <h3>{item.title}</h3>
          <p>Category: {item.category}</p>
          <p>{item.description}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}
