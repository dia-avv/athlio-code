import "./Tag.css";

//used for role and position

export default function Tag({ label }) {
  return (
    <div className="tag">
      <p>{label}</p>
    </div>
  );
}
