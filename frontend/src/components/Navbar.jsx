import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token =
    localStorage.getItem("access_token") || sessionStorage.getItem("access_token");

  function logout() {
    localStorage.removeItem("access_token");
    sessionStorage.removeItem("access_token");
    navigate("/login");
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="brand">
          <span className="brand-dot" />
          <span>MealPrep</span>
          <span className="muted" style={{ fontWeight: 600 }}>
            planner
          </span>
        </div>

        <nav className="nav-links">
          <Link to="/products">Products</Link>
          <Link to="/inventory">Inventory</Link>
          <Link to="/meals">Meals</Link>
          <Link to="/planner">Planner</Link>
          <Link to="/shopping-list">Shopping list</Link>

          {!token && <Link to="/login">Login</Link>}
          {token && (
            <button className="btn btn-ghost" onClick={logout}>
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
