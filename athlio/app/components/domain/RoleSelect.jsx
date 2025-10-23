export default function RoleSelect({ role, onChange }) {
  return (
    <div>
      <label>
        <input
          type="radio"
          checked={role === "athlete"}
          onChange={() => onChange("athlete")}
        />{" "}
        Athlete
      </label>
      <label>
        <input
          type="radio"
          checked={role === "scout"}
          onChange={() => onChange("scout")}
        />{" "}
        Scout
      </label>
      <label>
        <input
          type="radio"
          checked={role === "organization"}
          onChange={() => onChange("organization")}
        />{" "}
        Organization
      </label>
    </div>
  );
}
