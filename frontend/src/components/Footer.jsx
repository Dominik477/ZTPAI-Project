export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        marginTop: 40,
        borderTop: "1px solid rgba(176, 190, 197, 0.18)",
        background: "rgba(11, 18, 32, 0.55)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: "18px 16px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: 12,
          fontSize: 13,
        }}
      >
        <div className="muted">
          © {year} <strong>MealPrep Planner</strong>
        </div>

      
      </div>
    </footer>
  );
}
