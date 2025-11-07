import React, { useCallback } from "react";
import "./SelectionCard.css";

// SelectionCard is a reusable selectable card. When `groupName` and `value` are
// provided (and `onChange`), it acts like a radio within that group. If those
// props are omitted, it renders a non-interactive presentation-only card.
export default function SelectionCard({
  name,
  description,
  value,
  groupName,
  checked = false,
  onChange,
}) {
  const selectable = Boolean(groupName && value && typeof onChange === "function");

  const activate = useCallback(() => {
    if (selectable) onChange(value);
  }, [selectable, onChange, value]);

  const handleKey = useCallback(
    (e) => {
      if (!selectable) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        activate();
      }
    },
    [selectable, activate]
  );

  return (
    <div
      className={"role-card" + (checked ? " selected" : "")}
      role={selectable ? "radio" : undefined}
      aria-checked={selectable ? !!checked : undefined}
      tabIndex={selectable ? 0 : undefined}
      onKeyDown={handleKey}
      onClick={activate}
    >
      {selectable && (
        <input
          className="visually-hidden"
          type="radio"
          name={groupName}
          value={value}
          checked={checked}
          onChange={() => onChange(value)}
          aria-checked={checked}
          tabIndex={-1} /* keep only the card itself focusable */
        />
      )}

      <div className="role-body">
        <h3 className="role-title">{name}</h3>
        <p className="role-desc">{description}</p>
      </div>
    </div>
  );
}
