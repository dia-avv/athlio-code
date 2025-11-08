import React, { useState, useRef, useEffect } from 'react';
import './PlayerSelector.css';
import Button from '../../UI/Button';
import PlusIcon from '../../../assets/icons/plus.svg';
import { useNavigate } from 'react-router';

const SEASONS = [
  "Season 2025-26",
  "Season 2024-25",
  "Season 2023-24",
  "Season 2022-23"
];

const PlayerSelector = ({
  playerName = "Haine Eames",
  playerAvatar,
  onAddPlayer,
  onRemovePlayer,
  onSeasonChange
}) => {
  const [selectedSeason, setSelectedSeason] = useState(SEASONS[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // navigation to dedicated search page happens on button click

  const handleSeasonSelect = (season) => {
    setSelectedSeason(season);
    setIsDropdownOpen(false);
    if (onSeasonChange) {
      onSeasonChange(season);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  return (
    <div className="player-selector">
      <div className="player-selector-container">
        <div className="player-selector-controls">
          <div className="season-dropdown-wrapper" ref={dropdownRef}>
            <button className="season-selector" onClick={toggleDropdown}>
              <span className="season-text">{selectedSeason}</span>
              <img
                src="https://api.builder.io/api/v1/image/assets/e9cac1e18ae64186984fb4d639c633bc/9036da0af52d5c2760ad262991e1bd586471517e?placeholderIfAbsent=true"
                alt=""
                className="season-dropdown-icon"
              />
            </button>
            {isDropdownOpen && (
              <div className="season-dropdown-menu">
                {SEASONS.map((season) => (
                  <button
                    key={season}
                    className={`season-dropdown-item ${selectedSeason === season ? 'season-dropdown-item--active' : ''}`}
                    onClick={() => handleSeasonSelect(season)}
                  >
                    {season}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Button
            size="small"
            type="primary"
            label="Add a new player"
            Icon={PlusIcon}
            onClick={() => navigate('/scouting/search')}
          />
        </div>
        <div className="player-card">
          <div className="player-info">
            <img
              src={playerAvatar || "https://api.builder.io/api/v1/image/assets/e9cac1e18ae64186984fb4d639c633bc/ca6a6b3bca92753f7368d77ac0c3b68ccfcd5f6d?placeholderIfAbsent=true"}
              alt={playerName}
              className="player-avatar"
            />
            <div className="player-name">{playerName}</div>
          </div>
          <button className="remove-player-btn" onClick={onRemovePlayer} aria-label="Remove player">
            <img
              src="https://api.builder.io/api/v1/image/assets/e9cac1e18ae64186984fb4d639c633bc/9a4bd8d25649802c53894292b42a945f813bd1cd?placeholderIfAbsent=true"
              alt=""
              className="remove-icon"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerSelector;
