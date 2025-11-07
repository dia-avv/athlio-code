import "./RoleSelect.css";
import SelectionCard from "./UI/SelectionCard";

const ROLES = [
  {
    id: "athlete",
    title: "Athlete",
    description: "Create and manage your athlete profile, showcase stats and video.",
  },
  {
    id: "scout",
    title: "Scout",
    description: "Discover talent, save profiles and contact athletes.",
  },
  {
    id: "organization",
    title: "Organization",
    description: "Manage club or organization accounts and post opportunities.",
  },
];

export default function RoleSelect({ role, onChange }) {
  return (
    <div className="role-grid" role="radiogroup" aria-label="Choose your role">
      {ROLES.map((r) => {
        const selected = role === r.id;
        return (
          <SelectionCard
            key={r.id}
            name={r.title}
            description={r.description}
            value={r.id}
            groupName="role"
            checked={selected}
            onChange={onChange}
          />
        );
      })}
    </div>
  );
}
