import Textarea from "../../inputs/TextArea";

export default function Bio({ value, onChange }) {
  return (
    <div>
      <Textarea label="Bio" value={value || ""} onChange={onChange} />
    </div>
  );
}
