import { useEffect, useMemo, useState } from "react";
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

  const missingItems = useMemo(
    () => items.filter((it) => (it.missing_grams || 0) > 0),
    [items]
  );

  const totalMissing = useMemo(
    () => missingItems.reduce((sum, it) => sum + (it.missing_grams || 0), 0),
    [missingItems]
  );

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
          <div>
            <h2 style={{ marginTop: 0, marginBottom: 6 }}>Shopping list</h2>
            <p className="muted" style={{ margin: 0 }}>
              Generated from planner. Missing = Needed − In stock.
            </p>
          </div>

          <div className="no-print" style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {missingItems.length > 0 && (
              <span className="badge badge-missing">
                Missing: {Math.round(totalMissing)} g
              </span>
            )}
            <button className="btn btn-ghost" onClick={() => window.print()}>
              Print
            </button>
          </div>
        </div>
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
              {items.map((it) => {
                const missing = it.missing_grams || 0;
                const rowClass = missing > 0 ? "row-missing" : "";
                return (
                  <tr key={it.product_id} className={rowClass}>
                    <td>
                      {it.product_name}{" "}
                      {missing > 0 && (
                        <span className="badge badge-missing" style={{ marginLeft: 8 }}>
                          buy
                        </span>
                      )}
                    </td>
                    <td>{Math.round(it.total_needed_grams)}</td>
                    <td>{Math.round(it.in_stock_grams)}</td>
                    <td>
                      <strong>{Math.round(missing)}</strong>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {missingItems.length > 0 && (
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Only missing items</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th style={{ width: 160 }}>Missing (g)</th>
              </tr>
            </thead>
            <tbody>
              {missingItems.map((it) => (
                <tr key={it.product_id}>
                  <td>{it.product_name}</td>
                  <td>
                    <strong>{Math.round(it.missing_grams)}</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
