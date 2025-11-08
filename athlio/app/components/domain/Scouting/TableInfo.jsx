import React from 'react';
import './TableInfo.css';

function formatDate(date) {
  if (!date) return '—';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

function formatValue(playerMeta, row) {
  if (!playerMeta) return '—';
  const value = playerMeta[row.key];
  switch (row.key) {
    case 'age':
      if (value) return `${value} years`;
      if (playerMeta.birthdate) {
        const birth = new Date(playerMeta.birthdate);
        if (!Number.isNaN(birth.getTime())) {
          const diff = Date.now() - birth.getTime();
          const age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
          if (Number.isFinite(age)) return `${age} years`;
        }
      }
      return '—';
    case 'birthdate':
      return formatDate(value);
    case 'team':
      return playerMeta.teamName || '—';
    default:
      return value || '—';
  }
}

const INFO_ROWS = [
  { key: 'country', label: 'Nationality' },
  { key: 'age', label: 'Age' },
  { key: 'birthdate', label: 'Born in' },
  { key: 'team', label: 'Team' },
  { key: 'weightKg', label: 'Weight (Kg)' },
  { key: 'heightCm', label: 'Height (cm)' },
  { key: 'position', label: 'Position' },
  { key: 'shirtNumber', label: 'Shirt Number' },
  { key: 'preferredFoot', label: 'Preferred Foot' },
];

function TeamCell({ meta }) {
  if (!meta) return <span>—</span>;
  const name = meta.teamName || '—';
  const logo = meta.teamLogo;
  return (
    <span className="info-team-value">
      {logo && <img src={logo} alt={name} className="info-team-logo" />}
      <span>{name}</span>
    </span>
  );
}

function renderCell(meta, row) {
  if (row.key === 'team') {
    return <TeamCell meta={meta} />;
  }
  return formatValue(meta, row);
}

export default function TableInfo({ players = [], title = 'Personal Info' }) {
  if (!players.length) return null;
  const displayPlayers = players.slice(0, 3);

  return (
    <div className="info-table-card">
      <div className="info-table-header">{title}</div>
      <div className="info-table-body">
        {INFO_ROWS.map((row, idx) => (
          <div key={row.key} className={`info-table-row ${idx % 2 === 1 ? 'alt' : ''}`}>
            <div className="info-table-label">{row.label}</div>
              <div className="info-table-values">
                {displayPlayers.map((player) => (
                  <div key={`${player.id}-${row.key}`} className="info-table-value">
                    {renderCell(player.info, row)}
                  </div>
                ))}
              </div>
          </div>
        ))}
      </div>
    </div>
  );
}
