import React from 'react';
import TableStats from './TableStats';
import './Tables.css';
import TableVariant2Players from './TableVariant2Players';
import TableVariant3Players from './TableVariant3Players';

export default function Tables(){
  return (
    <div className="scouting-tables">
      <div className="tables-grid">
        <TableStats />
        <TableVariant2Players />
        <TableVariant3Players />
      </div>
    </div>
  )
}
