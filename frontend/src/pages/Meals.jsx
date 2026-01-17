import { useEffect, useState } from "react";
import api from "../api";

export default function Meals() {
  const [meals, setMeals] = useState([]);
  const [error, setError] = useState("");

  async function load() {
    setError("");
    try {
      const res = await api.get("/api/meals");
      setMeals(res.data);
    } catch {
      setError("Failed to load meals");
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Meals</h2>
        <p className="muted" style={{ marginTop: 6 }}>
          Meals are recipes made of products + grams. Calories are computed automatically.
        </p>
      </div>

      {error && <div style={{ color: "crimson" }}>{error}</div>}

      {meals.map((m) => (
        <div key={m.id} className="card">
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
            <strong>{m.name}</strong>
            <span className="muted">{Math.round(m.total_calories)} kcal</span>
          </div>

          <div style={{ marginTop: 10 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th style={{ width: 120 }}>grams</th>
                  <th style={{ width: 120 }}>kcal</th>
                </tr>
              </thead>
              <tbody>
                {m.items.map((it) => (
                  <tr key={it.product_id}>
                    <td>{it.product_name}</td>
                    <td>{it.quantity_grams}</td>
                    <td>{Math.round(it.calories)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
