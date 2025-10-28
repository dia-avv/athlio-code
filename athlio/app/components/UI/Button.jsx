import "./Button.css";
//size - medium or small
//type - primary, outline or subtle

export default function Button({ size = "", type = "", label, onClick }) {
  return (
    <button className={`button ${size} ${type}`} onClick={onClick}>
      <p>{label}</p>
    </button>
  );
}
