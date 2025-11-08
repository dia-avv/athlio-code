import React from 'react';
import './TableStats.css';

function formatInt(n) {
  const num = Number(n ?? 0);
  if (!Number.isFinite(num)) return '0';
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(num);
}

function formatMpg(n) {
  const num = Number(n ?? 0);
  if (!Number.isFinite(num)) return '0.0';
  return new Intl.NumberFormat(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(num);
}

export default function TableStats({ stats }) {
  const totalPlayed = stats?.totalPlayed ?? 0;
  const started = stats?.started ?? 0;
  const minutesPerGame = stats?.minutesPerGame ?? 0;
  const totalMinutes = stats?.totalMinutes ?? 0;

  return (
    <div className="table-stats">
      <div className="table-stats-header">Matches</div>

      <div className="table-stats-body">
        <div className="table-row">
          <div className="label">Total Played</div>
          <div className="value">{formatInt(totalPlayed)}</div>
        </div>

        <div className="table-row alt">
          <div className="label">Started</div>
          <div className="value">{formatInt(started)}</div>
        </div>

        <div className="table-row">
          <div className="label">Minutes per game</div>
          <div className="value">{formatMpg(minutesPerGame)}</div>
        </div>

        <div className="table-row alt">
          <div className="label">Total minutes played</div>
          <div className="value">{formatInt(totalMinutes)}</div>
        </div>
      </div>
    </div>
  );
}
