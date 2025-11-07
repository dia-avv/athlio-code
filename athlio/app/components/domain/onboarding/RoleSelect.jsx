import { useCallback } from "react";
import StarIcon from "../../../assets/icons/star.svg";
import SearchIcon from "../../../assets/icons/search.svg";
import PlusIcon from "../../../assets/icons/plus.svg";
import "./RoleSelect.css";

const ROLES = [
  {
    id: "athlete",
    title: "Athlete",
    description: "Create and manage your athlete profile, showcase stats and video.",
    icon: StarIcon,
  },
  {
    id: "scout",
    title: "Scout",
    description: "Discover talent, save profiles and contact athletes.",
    icon: SearchIcon,
  },
  {
    id: "organization",
    title: "Organization",
    description: "Manage club or organization accounts and post opportunities.",
    icon: PlusIcon,
  },
];

export default function RoleSelect({ role, onChange }) {
  const handleKey = useCallback(
    (e, id) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onChange(id);
      }
    },
    [onChange]
  );

  return (
    <div className="role-grid" role="radiogroup" aria-label="Choose your role">
      {ROLES.map((r) => {
        const selected = role === r.id;
        return (
          <label
            key={r.id}
            className={"role-card" + (selected ? " selected" : "")}
            tabIndex={0}
            onKeyDown={(e) => handleKey(e, r.id)}
          >
            <input
              type="radio"
              name="role"
              value={r.id}
              checked={selected}
              onChange={() => onChange(r.id)}
              aria-checked={selected}
              className="visually-hidden"
            />
            <img src={r.icon} alt="" aria-hidden="true" className="role-icon" />
            <div className="role-body">
              <h3 className="role-title">{r.title}</h3>
              <p className="role-desc">{r.description}</p>
            </div>
          </label>
        );
      })}
    </div>
  );
}
