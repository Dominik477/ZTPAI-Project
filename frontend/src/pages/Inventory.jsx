import { useEffect, useMemo, useState } from "react";
import api from "../api";

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [inventory, setInventory] = useState([]);

  const [selectedProductId, setSelectedProductId] = useState("");
  const [grams, setGrams] = useState("");

  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  async function loadAll() {
    const [prodRes, invRes] = await Promise.all([
      api.get("/api/products"),
      api.get("/api/inventory"),
    ]);
    setProducts(prodRes.data);
    setInventory(invRes.data);
  }

  useEffect(() => {
    (async () => {
      setError("");
      try {
        await loadAll();
      } catch {
        setError("Failed to load inventory data");
      }
    })();
  }, []);

  const invMap = useMemo(() => {
    const m = new Map();
    for (const row of inventory) m.set(row.product_id, row);
    return m;
  }, [inventory]);

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
      await loadAll();
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to save inventory item");
    }
  }

  function prefill(productId) {
    const row = invMap.get(productId);
    setSelectedProductId(String(productId));
    setGrams(row ? String(row.quantity_grams) : "0");
    setInfo("");
    setError("");
  }

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Inventory</h2>
        <p className="muted" style={{ marginTop: 6 }}>
          Track what you have at home (grams per product). Shopping list will subtract these amounts.
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
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
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

        {products.length === 0 ? (
          <div className="muted">No products yet.</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th style={{ width: 160 }}>In stock (g)</th>
                <th style={{ width: 140 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const row = invMap.get(p.id);
                const qty = row ? row.quantity_grams : 0;
                return (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{Math.round(qty)}</td>
                    <td>
                      <button className="btn btn-ghost" onClick={() => prefill(p.id)}>
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
