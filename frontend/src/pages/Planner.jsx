import { useEffect, useMemo, useState } from "react";
import api from "../api";

const DAYS = [
  { key: "mon", label: "Mon" },
  { key: "tue", label: "Tue" },
  { key: "wed", label: "Wed" },
  { key: "thu", label: "Thu" },
  { key: "fri", label: "Fri" },
  { key: "sat", label: "Sat" },
  { key: "sun", label: "Sun" },
];

export default function Planner() {
  const [meals, setMeals] = useState([]);
  const [plan, setPlan] = useState([]);
  const [selectedDay, setSelectedDay] = useState("mon");
  const [selectedMealId, setSelectedMealId] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  async function loadAll() {
    const [mealsRes, planRes] = await Promise.all([
      api.get("/api/meals"),
      api.get("/api/planner"),
    ]);
    setMeals(mealsRes.data);
    setPlan(planRes.data);
  }

  useEffect(() => {
    (async () => {
      setError("");
      try {
        await loadAll();
      } catch {
        setError("Failed to load planner data");
      }
    })();
  }, []);

  const planMap = useMemo(() => {
    const m = new Map();
    for (const p of plan) m.set(p.day, p);
    return m;
  }, [plan]);

  async function setDayMeal(e) {
    e.preventDefault();
    setError("");
    setInfo("");

    const meal_id = Number(selectedMealId);
    if (!selectedDay) return setError("Select a day");
    if (!Number.isFinite(meal_id) || meal_id <= 0) return setError("Select a meal");

    try {
      await api.post("/api/planner", { day: selectedDay, meal_id });
      setInfo("Saved");
      await loadAll();
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to save plan");
    }
  }

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Weekly planner</h2>
        <p className="muted" style={{ marginTop: 6 }}>
          Assign a meal to each day. Shopping list is generated from this plan.
        </p>
      </div>

      {error && <div style={{ color: "crimson" }}>{error}</div>}
      {info && <div style={{ color: "green" }}>{info}</div>}

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Set day</h3>

        <form onSubmit={setDayMeal} className="row">
          <div>
            <label className="muted">Day</label>
            <select
              className="input"
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
            >
              {DAYS.map((d) => (
                <option key={d.key} value={d.key}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="muted">Meal</label>
            <select
              className="input"
              value={selectedMealId}
              onChange={(e) => setSelectedMealId(e.target.value)}
            >
              <option value="">Select meal...</option>
              {meals.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({Math.round(m.total_calories)} kcal)
                </option>
              ))}
            </select>
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <button className="btn btn-primary" type="submit">
              Save
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Current plan</h3>

        <table className="table">
          <thead>
            <tr>
              <th style={{ width: 100 }}>Day</th>
              <th>Meal</th>
              <th style={{ width: 140 }}>kcal</th>
            </tr>
          </thead>
          <tbody>
            {DAYS.map((d) => {
              const p = planMap.get(d.key);
              return (
                <tr key={d.key}>
                  <td>{d.label}</td>
                  <td>{p ? p.meal_name : <span className="muted">—</span>}</td>
                  <td>{p ? Math.round(p.total_calories) : <span className="muted">—</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
