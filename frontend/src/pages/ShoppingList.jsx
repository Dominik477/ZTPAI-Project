import { useEffect, useState } from "react";
import api from "../api";

export default function ShoppingList() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  async function load() {
    const res = await api.get("/api/shopping-list");
    setItems(res.data);
  }

  useEffect(() => {
    (async () => {
      setError("");
      try {
        await load();
      } catch {
        setError("Failed to load shopping list");
      }
    })();
  }, []);

  const totalMissing = items.reduce((sum, it) => sum + (it.missing_grams || 0), 0);

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Shopping list</h2>
        <p className="muted" style={{ marginTop: 6 }}>
          Generated from planner. Missing = Needed − In stock.
        </p>
        {items.length > 0 && (
          <p className="muted" style={{ marginTop: 6 }}>
            Total missing (sum): <strong>{Math.round(totalMissing)} g</strong>
          </p>
        )}
      </div>

      {error && <div style={{ color: "crimson" }}>{error}</div>}

      <div className="card">
        {items.length === 0 ? (
          <div className="muted">No items yet. Set your weekly plan first.</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th style={{ width: 140 }}>Needed (g)</th>
                <th style={{ width: 140 }}>In stock (g)</th>
                <th style={{ width: 140 }}>Missing (g)</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.product_id}>
                  <td>{it.product_name}</td>
                  <td>{Math.round(it.total_needed_grams)}</td>
                  <td>{Math.round(it.in_stock_grams)}</td>
                  <td>
                    <strong>{Math.round(it.missing_grams)}</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
