import Textarea from "../../inputs/TextArea";
export default function GoalsField({ value, onChange }) {
  return <Textarea label="Goals" value={value} onChange={onChange} />;
}
