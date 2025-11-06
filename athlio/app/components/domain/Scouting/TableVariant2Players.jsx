import React from 'react';
import './TableVariant2Players.css';

export default function TableVariant2Players({
  players = [
    { name: 'Player A', stats: { totalPlayed: 20, started: 12, minutesPerGame: '12.2', totalMinutes: '1,098' } },
    { name: 'Player B', stats: { totalPlayed: 18, started: 10, minutesPerGame: '25.1', totalMinutes: '452' } }
  ]
}) {
  const keys = [
    { id: 'totalPlayed', label: 'Total Played' },
    { id: 'started', label: 'Started' },
    { id: 'minutesPerGame', label: 'Minutes per game' },
    { id: 'totalMinutes', label: 'Total minutes played' }
  ];

  return (
    <div className="table-variant-2players">
      <div className="tv-header">
        <div className="tv-title">Matches</div>
        <div className="tv-players">
          <div className="tv-player-name">{players[0]?.name}</div>
          <div className="tv-player-name">{players[1]?.name}</div>
        </div>
      </div>

      <div className="tv-body">
        {keys.map((k, idx) => (
          <div key={k.id} className={`tv-row ${idx % 2 === 1 ? 'alt' : ''}`}>
            <div className="tv-label">{k.label}</div>
            <div className="tv-values">
              <div className="tv-value">{players[0]?.stats?.[k.id]}</div>
              <div className="tv-value">{players[1]?.stats?.[k.id]}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
