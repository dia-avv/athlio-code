import { SPORT_POSITIONS } from "../../../utils/positions";

export default function PositionPage({ sport, value, onChange }) {
  const options = sport ? SPORT_POSITIONS[sport] || [] : [];

  if (!sport) {
    return <p>Please select a sport first</p>;
  }

  // Football: show a responsive grid of position cards
  if (sport === "football") {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px,1fr))", gap: 12 }}>
        {options.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            aria-pressed={value === p}
            style={{
              padding: 12,
              borderRadius: 8,
              border: value === p ? "2px solid var(--color-accent)" : "1px solid var(--color-gray-300)",
              background: value === p ? "rgba(64,81,253,0.07)" : "white",
              textAlign: "left",
            }}
          >
            <div style={{ fontWeight: 600 }}>{p}</div>
          </button>
        ))}
      </div>
    );
  }

  // Basketball or other: simple select
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">Select position</option>
      {options.map((p) => (
        <option key={p} value={p}>
          {p}
        </option>
      ))}
    </select>
  );
}
