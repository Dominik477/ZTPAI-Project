import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ display: "grid", gap: 24, maxWidth: 900, margin: "60px auto" }}>
      <div className="card">
        <h1 style={{ marginTop: 0, fontSize: 36 }}>
          MealPrep Planner
        </h1>

        <p className="muted" style={{ fontSize: 18, lineHeight: 1.6 }}>
          MealPrep Planner is a web application designed to help users plan meals,
          manage pantry inventory, and automatically generate shopping lists.
        </p>

        <p className="muted" style={{ lineHeight: 1.6 }}>
          The application connects products, meals, and a weekly planner into one
          coherent system. Based on planned meals, it calculates required ingredients,
          compares them with your current inventory, and shows exactly what you need
          to buy.
        </p>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Key features</h2>
        <ul style={{ lineHeight: 1.8 }}>
          <li>📦 Product and pantry inventory management</li>
          <li>🍽️ Meal composition with calorie and macro calculation</li>
          <li>📅 Weekly meal planner</li>
          <li>🛒 Automatic shopping list generation</li>
          <li>📉 Inventory reservation and consumption tracking</li>
          <li>🔐 User authentication with JWT</li>
        </ul>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Technology stack</h2>
        <ul style={{ lineHeight: 1.8 }}>
          <li>Backend: FastAPI + SQLAlchemy</li>
          <li>Frontend: React (Vite)</li>
          <li>Database: PostgreSQL</li>
          <li>Infrastructure: Docker & Docker Compose</li>
        </ul>
      </div>

      <div className="card" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link to="/login" className="btn btn-primary">
          Sign in
        </Link>
        <Link to="/register" className="btn btn-ghost">
          Create account
        </Link>
      </div>
    </div>
  );
}
