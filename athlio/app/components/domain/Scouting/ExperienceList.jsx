import React from 'react';
import './ExperienceList.css';

function formatRange(exp) {
  const startYear = exp.start_date ? new Date(exp.start_date).getFullYear() : null;
  const endYear = exp.is_current
    ? 'Present'
    : exp.end_date
      ? new Date(exp.end_date).getFullYear()
      : null;
  if (!startYear && !endYear) return '—';
  return `${startYear ?? '—'}${endYear ? ` to ${endYear}` : ''}`;
}

function ExperienceCard({ experience, isLast }) {
  const title = experience.team_name || experience.org_name || 'Experience';
  const subtitle = formatRange(experience);

  return (
    <div className={`experience-item ${isLast ? 'experience-item-last' : ''}`}>
      <div className="experience-item-inner">
        <img
          src={experience.logo_url || 'https://api.builder.io/api/v1/image/assets/e9cac1e18ae64186984fb4d639c633bc/1387350f5452187162fc99d01cfbcbf9743311d8?placeholderIfAbsent=true'}
          alt={title}
          className="experience-icon"
        />
        <div className="experience-info">
          <div className="experience-title">{title}</div>
          <div className="experience-subtitle">From {subtitle}</div>
        </div>
      </div>
    </div>
  );
}

export default function ExperienceList({ players = [] }) {
  const displayPlayers = players.slice(0, 3);
  if (!displayPlayers.length) return null;
  const hasAny = displayPlayers.some((player) => player.experiences?.length);

  return (
    <div className="experience-list">
      {!hasAny && <p className="experience-empty">No experiences yet.</p>}
      {displayPlayers.map((player) => (
        <div key={player.id} className="experience-container">
          <div className="experience-header">
            <div className="experience-header-inner">
              <img
                src={player.avatar || 'https://api.builder.io/api/v1/image/assets/e9cac1e18ae64186984fb4d639c633bc/d55767b1f51442ae0cefcb91f2a22018c88f6732?placeholderIfAbsent=true'}
                alt={player.name}
                className="experience-avatar"
              />
              <div className="experience-header-name">
                <div>{player.name}</div>
              </div>
            </div>
          </div>
          {player.experiences?.length ? (
            player.experiences.map((exp, index) => (
              <ExperienceCard
                key={`${player.id}-${exp.team_name || exp.org_name}-${exp.start_date}`}
                experience={exp}
                isLast={index === player.experiences.length - 1}
              />
            ))
          ) : (
            <p className="experience-empty-section">No experiences yet.</p>
          )}
        </div>
      ))}
    </div>
  );
}
