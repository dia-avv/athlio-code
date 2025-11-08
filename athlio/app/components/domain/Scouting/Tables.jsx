import React from 'react';
import TableStats from './TableStats';
import './Tables.css';
import TableVariant2Players from './TableVariant2Players';
import TableVariant3Players from './TableVariant3Players';

export default function Tables({ players = [] }){
  const count = players.length;

  return (
    <div className="scouting-tables">
      <div className="tables-grid">
        {count <= 1 && (
          <TableStats stats={players[0]?.stats} />
        )}
        {count === 2 && (
          <TableVariant2Players players={players.slice(0, 2)} />
        )}
        {count >= 3 && (
          <TableVariant3Players players={players.slice(0, 3)} />
        )}
      </div>
    </div>
  )
}
