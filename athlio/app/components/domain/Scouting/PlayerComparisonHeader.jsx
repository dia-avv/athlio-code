import React from 'react';
import './PlayerComparisonHeader.css';
import NavigationTabs from '../../UI/NavTabs';
import Button from '../../UI/Button';
import ArchiveIcon from "../../../assets/icons/archive.svg?react";
import PlayerSelector from './PlayerSelector';

const PlayerComparisonHeader = ({ onSave, onArchive, activeTab, onTabChange }) => {
  return (
    <>
      <header className="header">
        <div className="header-top">
          <div className="container">
            <div className="content">
              <h1 className="title">Player Comparison</h1>
              <div className="actions">
                <Button
                  size="small"
                  type="subtle"
                  Icon={ArchiveIcon}
                  onClick={onArchive}
                  
                />
                <Button
                  size="medium"
                  type="primary"
                  label="Save"
                  onClick={onSave}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="header-bottom">
          <NavigationTabs activeTab={activeTab} onTabChange={onTabChange} />
        </div>
      </header>

      <div>
        <PlayerSelector />
      </div>
    </>
  );
};

export default PlayerComparisonHeader;
