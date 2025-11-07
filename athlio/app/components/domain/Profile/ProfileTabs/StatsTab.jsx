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
    <main>
      <div className="profile-stats-tab">
        {/* === Match Stats Table === */}
        <section className="player-stats">
          <TableStats stats={exampleStats} />
        </section>
      </div>
    </main>
  );
}
