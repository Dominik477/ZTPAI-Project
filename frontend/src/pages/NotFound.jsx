import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div style={{ padding: 40 }}>
      <h1>404</h1>
      <p>This is wrong route.</p>
      <Link to="/">← Back to the homepage</Link>
    </div>
  );
}
