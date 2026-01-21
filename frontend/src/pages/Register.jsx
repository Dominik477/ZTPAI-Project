import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

export default function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setInfo("");

    try {
      await api.post("/api/auth/register", {
        email,
        full_name: fullName,
        password,
      });

      const res = await api.post("/api/auth/login", { email, password });
      const token = res.data.access_token;

      try {
        localStorage.setItem("access_token", token);
      } catch {
      }
      if (!localStorage.getItem("access_token")) {
        sessionStorage.setItem("access_token", token);
      }

      setInfo("Account created. Redirecting...");
      navigate("/products");
    } catch (err) {
      setError(err?.response?.data?.detail || "Registration failed");
    }
  }

  return (
    <div className="card" style={{ maxWidth: 520, margin: "40px auto" }}>
      <h2 style={{ marginTop: 0 }}>Create account</h2>
      <p className="muted" style={{ marginTop: 6 }}>
        Register to manage your products, meals and planner.
      </p>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12, marginTop: 14 }}>
        <div>
          <label className="muted">Email</label>
          <input
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="muted">Full name</label>
          <input
            className="input"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="muted">Password</label>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="min. 6 characters"
          />
        </div>

        {error && <div style={{ color: "crimson" }}>{error}</div>}
        {info && <div style={{ color: "green" }}>{info}</div>}

        <button className="btn btn-primary" type="submit">
          Register
        </button>

        <div className="muted" style={{ marginTop: 4 }}>
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </form>
    </div>
  );
}
