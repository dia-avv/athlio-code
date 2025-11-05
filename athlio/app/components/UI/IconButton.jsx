import "./IconButton.css";
//size - medium or small
//type - primary, neutral or subtle

export default function IconButton({
  size = "",
  type = "",
  icon: Icon,
  onClick,
}) {
  return (
    <button className={`icon-button ${size} ${type}`} onClick={onClick}>
      {Icon ? <Icon aria-hidden="true" /> : null}
    </button>
  );
}
