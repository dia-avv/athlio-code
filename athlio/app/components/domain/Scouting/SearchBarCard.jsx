import React from 'react';
import './SearchBarCard.css';
import defaultAvatar from '../../../assets/images/player.jpg';
import defaultTeamLogo from '../../../assets/logos/main-logo.svg?react';
import defaultFlag from '../../../assets/icons/verification.svg?react';

const SearchBarCard = ({
  playerName = 'Thomás De Martis',
  teamName = 'Lanús',
  nationality = 'Argentina',
  avatar = defaultAvatar,
  teamLogo = defaultTeamLogo,
  flag = defaultFlag
}) => {
  return (
    <div className="search-card-item">
      <div className="avatar-wrap" aria-hidden>
        <img src={avatar} alt={`${playerName} avatar`} className="avatar-img" />
      </div>

      <div className="info">
        <div className="name">{playerName}</div>
        <div className="meta">
          <span className="position">Midfielder</span>

          {teamLogo && <img src={teamLogo} alt={`${teamName} logo`} className="team-logo" />}
          <span className="team-name">{teamName}</span>

          {flag && <img src={flag} alt={nationality} className="flag" />}
          <span className="country">{nationality}</span>
        </div>
      </div>
    </div>
  );
};

export default SearchBarCard;
