export default function StatsTab({ profile }) {
  return (
    <div className="tab-section">
      <h3>Stats</h3>
      <p>Sport: {profile.primary_sport || "N/A"}</p>
      <p>Height: {profile.height_cm ? `${profile.height_cm} cm` : "N/A"}</p>
      <p>Weight: {profile.weight_kg ? `${profile.weight_kg} kg` : "N/A"}</p>
    </div>
  );
}
