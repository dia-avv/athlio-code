import MultiSelectComma from "../../inputs/MultiSelectComma";
export default function SportsSelect({
  sports,
  onChange,
  primarySport,
  onPrimaryChange,
}) {
  return (
    <div>
      <MultiSelectComma
        label="Sports"
        value={sports}
        onChange={onChange}
        placeholder="football,basketball"
      />
      {Array.isArray(sports) && sports.length > 0 ? (
        <select
          value={primarySport}
          onChange={(e) => onPrimaryChange(e.target.value)}
        >
          {sports.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      ) : null}
    </div>
  );
}
