import React from 'react';
import './Position.css';

const DEFAULT_IMAGE = 'http://localhost:3845/assets/9a3a5c9d56529e14f8fef7a17ab671b76ecb0fb0.svg';

export default function Position({ preferredPosition = 'Midfielder', imageUrl = DEFAULT_IMAGE }) {
  return (
    <div className="position-card" data-name="Position Card">
      <div className="position-card-inner">
        <div className="position-info">
          <div className="position-label">Preferred Position</div>
          <div className="position-pill">{preferredPosition}</div>
        </div>

        <div className="position-image-wrap">
          <img alt="" className="position-image" src={imageUrl} />
        </div>
      </div>
    </div>
  );
}
