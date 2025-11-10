import React from 'react';
import './PlayerComparisonCard.css';

const PlayerComparisonCard = ({ playerName, playerAvatar, onRemove, playerIndex, totalPlayers }) => {
  return (
    <div className={`player-comparison-card player-comparison-card--${totalPlayers}-players player-comparison-card--position-${playerIndex}`}>
      <div className="player-comparison-card-content">
        <div className="player-comparison-card-avatar-wrapper">
          <img
            src={playerAvatar || "https://api.builder.io/api/v1/image/assets/e9cac1e18ae64186984fb4d639c633bc/ca6a6b3bca92753f7368d77ac0c3b68ccfcd5f6d?placeholderIfAbsent=true"}
            alt={playerName}
            className="player-comparison-card-avatar"
          />
        </div>
        <div className="player-comparison-card-name">
          <span>{playerName}</span>
        </div>
      </div>
      <button 
        className="player-comparison-card-remove-btn" 
        onClick={onRemove}
        aria-label={`Remove ${playerName}`}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 3L3 9M3 3L9 9" stroke="#000215" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
};

export default PlayerComparisonCard;
