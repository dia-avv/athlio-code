export default function Premium({ onContinue }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <h2 style={{ margin: 0 }}>Upgrade to Premium</h2>
      <p style={{ margin: 0 }}>Get access to advanced search, priority placement and analytics.</p>
      <ul>
        <li>Advanced candidate filters</li>
        <li>Priority profile boosts</li>
        <li>Detailed analytics and insights</li>
      </ul>
      <div>
        <button type="button" onClick={onContinue} style={{ padding: 10, borderRadius: 8, background: "var(--color-accent)", color: "white", border: "none" }}>
          Continue
        </button>
      </div>
    </div>
  );
}
