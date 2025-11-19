import footballPitch from "../../../assets/graphics/football_pitch.svg";
import basketballCourt from "../../../assets/graphics/basketball-court.svg";
import "./PositionPage.css";

export default function PositionPage({ sport, value, onChange }) {
  // Define position layouts. Use the football pitch and football positions by
  // default, but switch to a basketball court + basketball roles when the
  // selected sport is basketball.
  const footballPositions = [
    // Positions in the exact order requested: lw, st, rw, cm, cdm, cm, lb, cb, cb, rb, gk
    { id: "lw", short: "LW", full: "Left Winger", left: 18, top: 22 },
    { id: "st", short: "ST", full: "Striker", left: 50, top: 18 },
    { id: "rw", short: "RW", full: "Right Winger", left: 82, top: 22 },
    { id: "cm_l", short: "CM", full: "Central Midfielder (Left)", left: 38, top: 36 },
    { id: "cdm", short: "CDM", full: "Defensive Midfielder", left: 50, top: 48 },
    { id: "cm_r", short: "CM", full: "Central Midfielder (Right)", left: 62, top: 36 },
    { id: "lb", short: "LB", full: "Left Back", left: 18, top: 70 },
    { id: "cb_l", short: "CB", full: "Center Back (Left)", left: 38, top: 74 },
    { id: "cb_r", short: "CB", full: "Center Back (Right)", left: 62, top: 74 },
    { id: "rb", short: "RB", full: "Right Back", left: 82, top: 70 },
    { id: "gk", short: "GK", full: "Goalkeeper", left: 50, top: 92 },
  ];

  const basketballPositions = [
    // Five standard basketball roles placed in the upper half of the court.
    // PG should be the most 'down' (closest to mid-court) among the group.
    { id: "pg", short: "PG", full: "Point Guard", left: 50, top: 34 },
    { id: "sg", short: "SG", full: "Shooting Guard", left: 32, top: 28 },
    { id: "sf", short: "SF", full: "Small Forward", left: 70, top: 28 },
    { id: "pf", short: "PF", full: "Power Forward", left: 34, top: 16 },
    { id: "c", short: "C", full: "Center", left: 64, top: 16 },
  ];

  const usingBasketball = String(sport).toLowerCase() === "basketball";
  const positions = usingBasketball ? basketballPositions : footballPositions;
  const selectedFullNames = positions
    .filter((p) => Array.isArray(value) && value.includes(p.id))
    .map((p) => p.full);

  function toggle(id) {
    // Multi-select semantics: maintain an array of selected ids. Add the id
    // when clicked; remove it when clicked again.
    const current = Array.isArray(value) ? value.slice() : [];
    const idx = current.indexOf(id);
    if (idx >= 0) {
      current.splice(idx, 1);
    } else {
      current.push(id);
    }
    onChange(current);
  }

  return (
    <div className="position-page">
      <div className="role-header position-role-header">
        <h1 className="role-header-title">Choose your position</h1>
        <p className="role-header-subtitle">You can select multiple</p>
      </div>

      <div className="position-pitch-wrapper">
        <div className="position-pitch-field">
          <img
            src={usingBasketball ? basketballCourt : footballPitch}
            alt={usingBasketball ? "Basketball court" : "Football pitch"}
            className="position-pitch-image"
          />

        {positions.map((p) => {
          const selected = Array.isArray(value) && value.includes(p.id);
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => toggle(p.id)}
              aria-pressed={selected}
              aria-label={p.full}
              title={p.full}
              className={`position-button${selected ? " position-button--selected" : ""}`}
              style={{
                left: `${p.left}%`,
                top: `${p.top}%`,
              }}
            >
              <span className="position-button-label">{p.short}</span>
            </button>
          );
        })}
        </div>
      </div>

      {selectedFullNames.length > 0 && (
        <div className="position-selection-summary">
          <p className="position-selection-title">Preffered Posititon</p>
          <div className="position-chip-list">
            {selectedFullNames.map((label) => (
              <span key={label} className="position-chip">
                {label}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
