import TableStats from "../../Scouting/TableStats"; // ✅ Corrected path
import "./StatsTab.css";

export default function StatsTab({ profile }) {
  // Placeholder data — later you can load actual stats dynamically
  const exampleStats = {
    totalPlayed: 20,
    started: 12,
    minutesPerGame: "12.2",
    totalMinutes: "1,098",
  };

  return (
    <div className="stats-tab">
      {/* === Basic Player Info === */}
      <section className="player-info">
        <h3 className="section-title">Player Info</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="label">Sport:</span>
            <span className="value">{profile.primary_sport || "N/A"}</span>
          </div>
          <div className="info-item">
            <span className="label">Height:</span>
            <span className="value">
              {profile.height_cm ? `${profile.height_cm} cm` : "N/A"}
            </span>
          </div>
          <div className="info-item">
            <span className="label">Weight:</span>
            <span className="value">
              {profile.weight_kg ? `${profile.weight_kg} kg` : "N/A"}
            </span>
          </div>
        </div>
      </section>

      {/* === Match Stats Table === */}
      <section className="player-stats">
        <h3 className="section-title">Performance</h3>
        <TableStats stats={exampleStats} />
      </section>
    </div>
  );
}
