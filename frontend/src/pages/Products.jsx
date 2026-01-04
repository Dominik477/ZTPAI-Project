import { useEffect, useState } from "react";
import api from "../api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [kcal, setKcal] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  async function load() {
    setError("");
    const res = await api.get("/api/products");
    setProducts(res.data);
  }

  useEffect(() => {
    load();
  }, []);

  async function createProduct(e) {
    e.preventDefault();
    setError("");
    setInfo("");

    const calories_per_100g = Number(kcal);
    if (!name.trim()) return setError("Name is required");
    if (!Number.isFinite(calories_per_100g) || calories_per_100g <= 0) {
      return setError("Calories must be a positive number");
    }

    try {
      await api.post("/api/products", { name: name.trim(), calories_per_100g });
      setName("");
      setKcal("");
      setInfo("Product created");
      await load();
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to create product");
    }
  }

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Products</h2>
        <p className="muted" style={{ marginTop: 6 }}>
          Manage your ingredients base. Creating a product requires login (JWT).
        </p>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Add product</h3>

        <form onSubmit={createProduct} className="row">
          <div>
            <label className="muted">Name</label>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Greek yogurt"
            />
          </div>

          <div>
            <label className="muted">kcal / 100g</label>
            <input
              className="input"
              value={kcal}
              onChange={(e) => setKcal(e.target.value)}
              placeholder="e.g. 61"
            />
          </div>

          <div style={{ gridColumn: "1 / -1", display: "flex", gap: 10, alignItems: "center" }}>
            <button className="btn btn-primary" type="submit">
              Create
            </button>
            {info && <span style={{ color: "green" }}>{info}</span>}
            {error && <span style={{ color: "crimson" }}>{error}</span>}
          </div>
        </form>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>All products</h3>
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: 80 }}>ID</th>
              <th>Name</th>
              <th style={{ width: 140 }}>kcal/100g</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.calories_per_100g}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
