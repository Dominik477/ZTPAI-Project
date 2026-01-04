import { useEffect, useState } from "react";
import { api } from "../api";

export default function Products() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setError("");
      try {
        const res = await api.get("/api/products");
        setItems(res.data);
      } catch (err) {
        setError("Failed to load products");
      }
    }
    load();
  }, []);

  return (
    <div>
      <h2>Products</h2>
      {error && <div style={{ color: "crimson" }}>{error}</div>}

      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>kcal/100g</th>
          </tr>
        </thead>
        <tbody>
          {items.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.calories_per_100g}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
