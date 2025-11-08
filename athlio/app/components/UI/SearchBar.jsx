import React from 'react';
import './SearchBar.css';
import SearchIcon from '../../assets/icons/search.svg';
import CloseIcon from '../../assets/icons/close.svg';

const SearchBar = ({ label = 'Search', onClick, onClear }) => {
  return (
    <div className="search-card" role="button" onClick={onClick} tabIndex={0}>
      <div className="search-content">
        <span className="search-icon" aria-hidden>
          <img src={SearchIcon} alt="" />
        </span>
        <span className="search-label">{label}</span>
        {onClear && (
          <button
            className="search-clear"
            onClick={(e) => { e.stopPropagation(); onClear(); }}
            aria-label="Clear search"
          >
            <img src={CloseIcon} alt="" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
