import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ display: "grid", gap: 18, maxWidth: 1120, margin: "40px auto" }}>
      <div className="card" style={{ padding: 22 }}>
        <div style={{ display: "grid", gap: 10 }}>
          <div className="muted" style={{ letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 900 }}>
            Meal Prep • Planner • Inventory
          </div>

          <h1 style={{ margin: 0, fontSize: 44, lineHeight: 1.05, letterSpacing: "-0.03em" }}>
            Plan meals, track pantry, generate shopping lists.
          </h1>

          <p className="muted" style={{ margin: 0, fontSize: 18, lineHeight: 1.6, maxWidth: 880 }}>
            MealPrep Planner connects products, meals and a weekly planner into one system.
            It calculates required ingredients, compares them with your current stock and shows what’s missing.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}>
            <Link to="/login" className="btn btn-primary">
              Sign in
            </Link>
            <Link to="/register" className="btn btn-ghost">
              Create account
            </Link>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Key features</h2>
          <ul style={{ lineHeight: 1.85, margin: 0, paddingLeft: 18 }}>
            <li>📦 Products + pantry stock tracking</li>
            <li>🍽️ Meals built from products (grams)</li>
            <li>📅 Weekly planner with automatic reservations</li>
            <li>🛒 Shopping list based on planned meals</li>
            <li>🔥 “Cook meal” decreases inventory</li>
            <li>🔐 Auth (JWT)</li>
          </ul>
        </div>

        <div className="card">
          <h2 style={{ marginTop: 0 }}>Technology</h2>
          <ul style={{ lineHeight: 1.85, margin: 0, paddingLeft: 18 }}>
            <li>Backend: FastAPI + SQLAlchemy</li>
            <li>Frontend: React (Vite)</li>
            <li>Database: PostgreSQL</li>
            <li>Docker & Docker Compose</li>
          </ul>
          <div className="muted" style={{ marginTop: 10, lineHeight: 1.6 }}>
            Designed as an engineering thesis project with clear domain logic and modular architecture.
          </div>
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>How it works</h2>
        <ol style={{ lineHeight: 1.85, margin: 0, paddingLeft: 18 }}>
          <li>Add products (calories/macros per 100g).</li>
          <li>Create meals and add ingredients with grams.</li>
          <li>Plan meals for the week.</li>
          <li>Check shopping list: needed vs stock vs missing.</li>
          <li>Cook a meal to consume inventory.</li>
        </ol>
      </div>
    </div>
  );
}
