import React from 'react';
import './TableVariant3Players.css';

export default function TableVariant3Players({
  players = [
    { stats: { totalPlayed: 20, started: 12, minutesPerGame: '12.2', totalMinutes: '1,098' } },
    { stats: { totalPlayed: 18, started: 10, minutesPerGame: '25.1', totalMinutes: '452' } },
    { stats: { totalPlayed: 15, started: 8, minutesPerGame: '30.4', totalMinutes: '456' } }
  ]
}) {
  const keys = [
    { id: 'totalPlayed', label: 'Total Played' },
    { id: 'started', label: 'Started' },
    { id: 'minutesPerGame', label: 'Minutes per game' },
    { id: 'totalMinutes', label: 'Total minutes played' }
  ];

  return (
    <div className="table-variant-3players">
      <div className="tv3-header">
        <div className="tv3-title">Matches</div>
        <div className="tv3-players">
          {players.map((p, i) => (
            <div key={i} className="tv3-player-name">{p.name}</div>
          ))}
        </div>
      </div>

      <div className="tv3-body">
        {keys.map((k, idx) => (
          <div key={k.id} className={`tv3-row ${idx % 2 === 1 ? 'alt' : ''}`}>
            <div className="tv3-label">{k.label}</div>
            <div className="tv3-values">
              {players.map((p, i) => (
                <div key={i} className="tv3-value">{p?.stats?.[k.id]}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
