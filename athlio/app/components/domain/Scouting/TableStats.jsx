import React from 'react';
import './TableStats.css';

export default function TableStats({
  stats = { totalPlayed: 20, started: 12, minutesPerGame: '12.2', totalMinutes: '1,098' }
}) {
  const { totalPlayed, started, minutesPerGame, totalMinutes } = stats;

  return (
    <div className="table-stats">
      <div className="table-stats-header">Matches</div>

      <div className="table-stats-body">
        <div className="table-row">
          <div className="label">Total Played</div>
          <div className="value">{totalPlayed}</div>
        </div>

        <div className="table-row alt">
          <div className="label">Started</div>
          <div className="value">{started}</div>
        </div>

        <div className="table-row">
          <div className="label">Minutes per game</div>
          <div className="value">{minutesPerGame}</div>
        </div>

        <div className="table-row alt">
          <div className="label">Total minutes played</div>
          <div className="value">{totalMinutes}</div>
        </div>
      </div>
    </div>
  );
}
