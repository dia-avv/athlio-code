import "./Button.css";

export default function Button({ size = "", type = "", label, onClick }) {
  return (
    <button className={`button ${size} ${type}`} onClick={onClick}>
      <p>{label}</p>
    </button>
  );
}
