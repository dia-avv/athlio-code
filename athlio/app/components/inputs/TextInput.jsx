export default function TextInput({
  label,
  value,
  onChange,
  placeholder,
  name,
  type = "text",
}) {
  return (
    <label>
      {label ? <span>{label}</span> : null}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
