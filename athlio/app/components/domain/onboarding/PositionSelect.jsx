import { SPORT_POSITIONS } from "../../../utils/positions";
export default function PositionSelect({ sport, value, onChange }) {
  const options = sport ? SPORT_POSITIONS[sport] || [] : [];
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
