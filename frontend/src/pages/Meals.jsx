import { useEffect, useMemo, useState } from "react";
import api from "../api";

export default function Meals() {
  const [meals, setMeals] = useState([]);
  const [products, setProducts] = useState([]);

  const [name, setName] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [grams, setGrams] = useState("");
  const [draftItems, setDraftItems] = useState([]);

  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  async function loadMeals() {
    const res = await api.get("/api/meals");
    setMeals(res.data);
  }

  async function loadProducts() {
    const res = await api.get("/api/products");
    setProducts(res.data);
  }

  useEffect(() => {
    (async () => {
      setError("");
      try {
        await Promise.all([loadMeals(), loadProducts()]);
      } catch {
        setError("Failed to load data");
      }
    })();
  }, []);

  const selectedProduct = useMemo(() => {
    const id = Number(selectedProductId);
    return products.find((p) => p.id === id) || null;
  }, [selectedProductId, products]);

  function addDraftItem(e) {
    e.preventDefault();
    setError("");
    setInfo("");

    const pid = Number(selectedProductId);
    const qty = Number(grams);

    if (!name.trim()) return setError("Meal name is required");
    if (!Number.isFinite(pid) || pid <= 0) return setError("Select a product");
    if (!Number.isFinite(qty) || qty <= 0) return setError("Grams must be a positive number");

    setDraftItems((prev) => {
      const existing = prev.find((x) => x.product_id === pid);
      if (existing) {
        return prev.map((x) =>
          x.product_id === pid ? { ...x, quantity_grams: x.quantity_grams + qty } : x
        );
      }
      return [...prev, { product_id: pid, quantity_grams: qty }];
    });

    setSelectedProductId("");
    setGrams("");
  }

  function removeDraftItem(productId) {
    setDraftItems((prev) => prev.filter((x) => x.product_id !== productId));
  }

  async function createMeal(e) {
    e.preventDefault();
    setError("");
    setInfo("");

    if (!name.trim()) return setError("Meal name is required");
    if (draftItems.length === 0) return setError("Add at least one product to the meal");

    try {
      await api.post("/api/meals", { name: name.trim(), items: draftItems });
      setName("");
      setDraftItems([]);
      setInfo("Meal created");
      await loadMeals();
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to create meal");
    }
  }

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Meals</h2>
        <p className="muted" style={{ marginTop: 6 }}>
          Create meals from products + grams. Calories are computed automatically.
        </p>
      </div>

      {error && <div style={{ color: "crimson" }}>{error}</div>}
      {info && <div style={{ color: "green" }}>{info}</div>}

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Create meal</h3>

        <form onSubmit={createMeal} style={{ display: "grid", gap: 12 }}>
          <div>
            <label className="muted">Meal name</label>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Chicken & rice"
            />
          </div>

          <div className="row">
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
                    {p.name} ({p.calories_per_100g} kcal/100g)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="muted">Grams</label>
              <input
                className="input"
                value={grams}
                onChange={(e) => setGrams(e.target.value)}
                placeholder="e.g. 150"
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-ghost" onClick={addDraftItem}>
              Add item
            </button>
            <button className="btn btn-primary" type="submit">
              Create meal
            </button>
          </div>

          {draftItems.length > 0 && (
            <div style={{ marginTop: 4 }}>
              <div className="muted" style={{ marginBottom: 8 }}>
                Meal items:
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th style={{ width: 140 }}>grams</th>
                    <th style={{ width: 140 }}>action</th>
                  </tr>
                </thead>
                <tbody>
                  {draftItems.map((it) => {
                    const p = products.find((x) => x.id === it.product_id);
                    return (
                      <tr key={it.product_id}>
                        <td>{p ? p.name : `Product ${it.product_id}`}</td>
                        <td>{it.quantity_grams}</td>
                        <td>
                          <button className="btn btn-ghost" onClick={() => removeDraftItem(it.product_id)}>
                            Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </form>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>All meals</h3>

        {meals.length === 0 ? (
          <div className="muted">No meals yet.</div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {meals.map((m) => (
              <div key={m.id} className="card" style={{ borderRadius: 14 }}>
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
        )}
      </div>
    </div>
  );
}
