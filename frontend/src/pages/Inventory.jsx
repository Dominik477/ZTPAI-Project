import { useEffect, useState } from "react";
import api from "../api";

export default function Inventory() {
  const [rows, setRows] = useState([]);

  const [selectedProductId, setSelectedProductId] = useState("");
  const [grams, setGrams] = useState("");

  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  async function load() {
    const res = await api.get("/api/inventory");
    setRows(res.data);
  }

  useEffect(() => {
    (async () => {
      setError("");
      try {
        await load();
      } catch {
        setError("Failed to load inventory");
      }
    })();
  }, []);

  async function saveItem(e) {
    e.preventDefault();
    setError("");
    setInfo("");

    const product_id = Number(selectedProductId);
    const quantity_grams = Number(grams);

    if (!Number.isFinite(product_id) || product_id <= 0) return setError("Select a product");
    if (!Number.isFinite(quantity_grams) || quantity_grams < 0)
      return setError("Grams must be a number >= 0");

    try {
      await api.post("/api/inventory", { product_id, quantity_grams });
      setSelectedProductId("");
      setGrams("");
      setInfo("Saved");
      await load();
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to save inventory item");
    }
  }

  function prefill(productId) {
    const row = rows.find((r) => r.product_id === productId);
    setSelectedProductId(String(productId));
    setGrams(String(row ? row.quantity_grams : 0));
    setInfo("");
    setError("");
  }

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Inventory</h2>
        <p className="muted" style={{ marginTop: 6 }}>
          Stock is your real pantry. Reserved is computed from the weekly planner. Available = Stock − Reserved.
        </p>
      </div>

      {error && <div style={{ color: "crimson" }}>{error}</div>}
      {info && <div style={{ color: "green" }}>{info}</div>}

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Set stock</h3>

        <form onSubmit={saveItem} className="row">
          <div>
            <label className="muted">Product</label>
            <select
              className="input"
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
            >
              <option value="">Select product...</option>
              {rows.map((r) => (
                <option key={r.product_id} value={r.product_id}>
                  {r.product_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="muted">In stock (grams)</label>
            <input
              className="input"
              value={grams}
              onChange={(e) => setGrams(e.target.value)}
              placeholder="e.g. 500"
            />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <button className="btn btn-primary" type="submit">
              Save
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Current stock</h3>

        <table className="table">
          <thead>
            <tr>
              <th>Product</th>
              <th style={{ width: 140 }}>Stock (g)</th>
              <th style={{ width: 140 }}>Reserved (g)</th>
              <th style={{ width: 160 }}>Available (g)</th>
              <th style={{ width: 120 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const available = r.available_grams;
              return (
                <tr key={r.product_id} className={available < 0 ? "row-missing" : ""}>
                  <td>{r.product_name}</td>
                  <td>{Math.round(r.quantity_grams)}</td>
                  <td>{Math.round(r.reserved_grams)}</td>
                  <td>
                    <strong style={{ color: available < 0 ? "crimson" : undefined }}>
                      {Math.round(available)}
                    </strong>
                  </td>
                  <td>
                    <button className="btn btn-ghost" onClick={() => prefill(r.product_id)}>
                      Edit
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="muted" style={{ marginTop: 10 }}>
          Tip: change Planner and come back here — Reserved updates automatically.
        </div>
      </div>
    </div>
  );
}
