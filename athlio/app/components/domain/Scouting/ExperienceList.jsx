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

function ExperienceCard({ experience }) {
  const title = experience.team_name || experience.org_name || 'Experience';
  const subtitle = formatRange(experience);

  return (
    <div className="experience-card">
      <div className="experience-avatar" aria-hidden="true">
        {experience.logo_url ? (
          <img src={experience.logo_url} alt={title} />
        ) : (
          <div className="experience-avatar-placeholder" />
        )}
      </div>
      <div className="experience-content">
        <p className="experience-title">{title}</p>
        <p className="experience-subtitle">{subtitle}</p>
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
        <section key={player.id} className="experience-section">
          <header className="experience-section-header">
            <h3>{player.name}</h3>
          </header>
          {player.experiences?.length ? (
            player.experiences.map((exp) => (
              <ExperienceCard
                key={`${player.id}-${exp.team_name || exp.org_name}-${exp.start_date}`}
                experience={exp}
              />
            ))
          ) : (
            <p className="experience-empty-section">No experiences yet.</p>
          )}
        </section>
      ))}
    </div>
  );
}
