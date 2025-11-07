export default function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}) {
  return (
    <label>
      {label ? <span>{label}</span> : null}
      <textarea
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
