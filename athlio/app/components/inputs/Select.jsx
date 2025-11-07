export default function Select({ label, value, onChange, options }) {
  return (
    <label>
      {label ? <span>{label}</span> : null}
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((opt) => (
          <option key={String(opt.value)} value={opt.value}>
            {opt.label ?? opt.value}
          </option>
        ))}
      </select>
    </label>
  );
}
