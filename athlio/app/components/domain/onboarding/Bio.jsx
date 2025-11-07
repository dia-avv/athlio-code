import Textarea from "../../inputs/TextArea";

export default function Bio({ value, onChange }) {
  return (
    <div>
      <div
        className="role-header"
        style={{ display: "inline-flex", flexDirection: "column", gap: 8 }}
      >
        <h1 className="role-header-title">You’re almost there!</h1>
        <p className="role-header-subtitle">Write a short bio using the info you shared or choose one of our suggested examples to get started.</p>
      </div>
      <Textarea label="Bio" value={value || ""} onChange={onChange} />
    </div>
  );
}
