import React, { useEffect, useState } from 'react';
import './SearchBarCard.css';
import profilePlaceholder from '../../../assets/icons/profile.png';
import DefaultTeamLogo from '../../../assets/logos/main-logo.svg?react';
import DefaultFlag from '../../../assets/icons/verification.svg?react';
import { supabase } from '../../../lib/supabase';

const SearchBarCard = ({
  profileId,
  playerName: fallbackName = 'Player',
  teamName: fallbackTeam = '—',
  nationality: fallbackCountry = '—',
  avatar: fallbackAvatar = profilePlaceholder,
  teamLogo,
  flag,
  onSelect,
}) => {
  const [state, setState] = useState({
    loading: !!profileId,
    name: fallbackName,
    team: fallbackTeam,
    country: fallbackCountry,
    avatar: fallbackAvatar,
    teamLogoUrl: teamLogo || null,
    flagUrl: flag || null,
  });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!profileId) return;
      setState((s) => ({ ...s, loading: true }));
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, avatar_url, country, club_other_name, club_id')
        .eq('id', profileId)
        .maybeSingle();
      if (cancelled) return;
      if (error) {
        console.error('SearchBarCard profile fetch', error);
        setState((s) => ({ ...s, loading: false }));
        return;
      }
      let teamName = data?.club_other_name || fallbackTeam;
      let teamLogoUrl = teamLogo || null;

      if (data?.club_id) {
        const { data: clubRow, error: clubErr } = await supabase
          .from('clubs')
          .select('name, logo_url')
          .eq('id', data.club_id)
          .maybeSingle();
        if (!clubErr && clubRow) {
          teamName = data?.club_other_name || clubRow.name || fallbackTeam;
          teamLogoUrl = clubRow.logo_url || null;
        }
      }
      const country = data?.country || fallbackCountry;
      setState({
        loading: false,
        name: data?.full_name || fallbackName,
        team: teamName,
        country,
        avatar: data?.avatar_url || fallbackAvatar,
        teamLogoUrl,
        flagUrl: flag || null,
      });
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [profileId]);

  const { name, team, country, avatar, teamLogoUrl, flagUrl } = state;

  return (
    <button className="search-card-item" onClick={() => onSelect?.(profileId)}>
      <div className="avatar-wrap" aria-hidden>
        <img
          src={avatar || profilePlaceholder}
          alt={`${name} avatar`}
          className="avatar-img"
          onError={(event) => {
            if (event.currentTarget.src !== profilePlaceholder) {
              event.currentTarget.src = profilePlaceholder;
            }
          }}
        />
      </div>

      <div className="info">
        <div className="name">{name}</div>
        <div className="meta">
          <span className="position">Midfielder</span>

          {teamLogoUrl ? (
            <img src={teamLogoUrl} alt={`${team} logo`} className="team-logo" />
          ) : (
            <DefaultTeamLogo className="team-logo" aria-hidden="true" />
          )}
          <span className="team-name">{team}</span>

          {flagUrl ? (
            <img src={flagUrl} alt={country} className="flag" />
          ) : (
            <DefaultFlag className="flag" aria-hidden="true" />
          )}
          <span className="country">{country}</span>
        </div>
      </div>
    </button>
  );
};

export default SearchBarCard;
