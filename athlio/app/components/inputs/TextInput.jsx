import "./TextInput.css";

export default function TextInput({
  label,
  value,
  onChange,
  placeholder,
  name,
  type = "text",
}) {
  return (
    <label className="textinput-container">
      {label ? <span className="textinput-label">{label}</span> : null}
      <div className="textinput-wrapper">
        <div className="textinput-inner">
          <input
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="textinput-field"
          />
        </div>
      </div>
    </label>
  );
}
