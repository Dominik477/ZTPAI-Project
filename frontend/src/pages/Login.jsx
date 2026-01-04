import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("user@example.com");
  const [password, setPassword] = useState("haslo123");
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/api/auth/login", { email, password });
      localStorage.setItem("access_token", res.data.access_token);
      navigate("/products");
    } catch (err) {
      setError(err?.response?.data?.detail || "Login failed");
    }
  }

  return (
    <div className="card" style={{ maxWidth: 520, margin: "40px auto" }}>
      <h2 style={{ marginTop: 0 }}>Sign in</h2>
      <p className="muted" style={{ marginTop: 6 }}>
        Use your account to manage products.
      </p>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12, marginTop: 14 }}>
        <div>
          <label className="muted">Email</label>
          <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div>
          <label className="muted">Password</label>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <div style={{ color: "crimson" }}>{error}</div>}

        <button className="btn btn-primary" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}
