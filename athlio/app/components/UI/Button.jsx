import "./Button.css";
//size - medium or small
//type - primary, outline or subtle

export default function Button({ size = "", type = "", label, onClick, Icon }) {
  return (
    <button className={`button ${size} ${type}`} onClick={onClick}>
      {Icon && <Icon className="button-icon" />}
      <p>{label}</p>
    </button>
  );
}
