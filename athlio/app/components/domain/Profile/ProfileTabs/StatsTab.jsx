// app/components/domain/Profile/ProfileTabs/StatsTab.jsx
import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";
import TableStats from "../../Scouting/TableStats";
import EditIcon from "../../../../assets/icons/edit.svg?react";
import "./StatsTab.css";
import Button from "../../../UI/Button";
import SeasonInfograph from "../ProfileTabs/SeasonInfograph";
import TablePassing from "../../Scouting/TablePassing";
import TableDefending from "../../Scouting/TableDefending";
import TableAttacking from "../../Scouting/TableAttacking";

export default function StatsTab({ profile, isMe = false }) {
  const [loading, setLoading] = useState(true);
  const [seasons, setSeasons] = useState([]); // array of season rows
  const [error, setError] = useState(null);
  const [selectedSeasonIndex, setSelectedSeasonIndex] = useState(null);

  useEffect(() => {
    if (!profile?.id) return;

    async function fetchPlayerSeasons() {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("player_season_stats")
        .select("*")
        .eq("profile_id", profile.id)
        .order("id", { ascending: true });

      console.log("player_season_stats rows sample:", data && data[0]);

      if (error) {
        console.error("Error fetching player seasons:", error);
        setError("Could not load seasonal stats.");
        setSeasons([]);
        setLoading(false);
        return;
      }

      // resolve season UUIDs if needed
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

      const seasonIds = Array.from(
        new Set(
          (data || [])
            .flatMap((r) => [r?.season_id, r?.season_name])
            .filter(Boolean)
            .filter((v) => uuidRegex.test(String(v))),
        ),
      );

      let seasonMap = {};
      if (seasonIds.length > 0) {
        try {
          const { data: seasonsRows, error: seasonsErr } = await supabase
            .from("seasons")
            .select("id, code, starts_on, ends_on")
            .in("id", seasonIds);

          console.log("resolved seasons rows:", seasonsRows, seasonsErr);
          if (!seasonsErr && Array.isArray(seasonsRows)) {
            seasonsRows.forEach((s) => {
              seasonMap[s.id] = s;
            });
          } else if (seasonsErr) {
            console.warn("Could not resolve seasons table:", seasonsErr);
          }
        } catch (e) {
          console.warn("Seasons lookup failed", e);
        }
      }

      // build normalized series
      const rawSeries = (data || []).map((row) => {
        // label resolution
        let label = null;
        if (row.season_name && !uuidRegex.test(String(row.season_name))) {
          label = String(row.season_name);
        }
        const refId = row.season_id ?? row.season_name;
        if (!label && refId && seasonMap[String(refId)]) {
          const s = seasonMap[String(refId)];
          if (s.starts_on && s.ends_on) {
            try {
              const sY = new Date(s.starts_on).getFullYear();
              const eY = new Date(s.ends_on).getFullYear();
              if (!Number.isNaN(sY) && !Number.isNaN(eY)) label = `${sY}-${eY}`;
            } catch (e) {}
          }
          if (!label && s.code) label = String(s.code);
        }
        if (!label) {
          const start =
            row.start_year ?? row.year_start ?? row.season_start ?? row.start;
          const end = row.end_year ?? row.year_end ?? row.season_end ?? row.end;
          if (start && end) label = `${start}-${end}`;
        }
        if (!label) {
          const startDate = row.start_date || row.start_at || row.from_date;
          const endDate = row.end_date || row.end_at || row.to_date;
          try {
            if (startDate && endDate) {
              const sY = new Date(startDate).getFullYear();
              const eY = new Date(endDate).getFullYear();
              if (!Number.isNaN(sY) && !Number.isNaN(eY)) label = `${sY}-${eY}`;
            }
          } catch (e) {}
        }
        if (!label) label = "—";

        return {
          label,
          // core KPI numbers
          matches: Number(row.appearances ?? row.matches ?? row.played ?? 0),
          goals: Number(row.goals ?? row.goals_scored ?? 0),
          assists: Number(row.assists ?? 0),

          // additional fields
          starts: Number(row.starts ?? row.starts_count ?? 0),
          minutes_per_game: Number(
            row.minutes_per_game ?? row.minutesPerGame ?? 0,
          ),
          minutes: Number(row.minutes ?? 0),

          scoring_per_minute: Number(
            row.scoring_per_minute ?? row.scoringPerMinute ?? 0,
          ),
          goals_per_game: Number(row.goals_per_game ?? row.goalsPerGame ?? 0),
          shots_per_game: Number(row.shots_per_game ?? row.shotsPerGame ?? 0),
          touches_per_game: Number(
            row.touches_per_game ?? row.touchesPerGame ?? 0,
          ),
          big_chances_created: Number(row.big_chances_created ?? 0),
          key_passes_per_game: Number(
            row.key_passes_per_game ?? row.keyPassesPerGame ?? 0,
          ),

          interceptions_per_game: Number(
            row.interceptions_per_game ?? row.interceptionsPerGame ?? 0,
          ),
          tackles_per_game: Number(
            row.tackles_per_game ?? row.tacklesPerGame ?? 0,
          ),
          balls_recovered: Number(row.balls_recovered ?? 0),
          penalties_committed: Number(row.penalties_committed ?? 0),
        };
      });

      // Try to sort by the first year found in label (works with "YYYY-YYYY" or "YYYY-YY" codes)
      const series = rawSeries.sort((a, b) => {
        const parseYear = (label) => {
          if (!label || label === "—") return 0;
          const m = String(label).match(/^(\d{4})/);
          return m ? Number(m[1]) : 0;
        };
        return parseYear(a.label) - parseYear(b.label);
      });

      console.log("series for infograph:", series);

      setSeasons(series);
      setLoading(false);
    }

    fetchPlayerSeasons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id]);

  // when seasons change, default selected to last (newest) if not already set
  useEffect(() => {
    if (seasons && seasons.length) {
      setSelectedSeasonIndex((prev) =>
        prev === null ? seasons.length - 1 : prev,
      );
    }
  }, [seasons]);

  if (loading) return <div className="page">Loading stats...</div>;
  if (error) return <div className="page">{error}</div>;
  if (!seasons || seasons.length === 0)
    return <div className="page">No stats available for this player.</div>;

  // choose selected season (falls back to newest)
  const latestIndex = selectedSeasonIndex ?? seasons.length - 1;
  const latest = seasons[latestIndex] || {};

  const players = [
    {
      id: profile.id,
      full_name: profile.full_name,
      stats: {
        totalPlayed: Number(latest.matches ?? 0),
        started: Number(latest.starts ?? latest.starts_count ?? 0),
        minutesPerGame: Number(
          latest.minutes_per_game ?? latest.minutesPerGame ?? 0,
        ),
        totalMinutes: Number(latest.minutes ?? 0),

        // attacking/passing
        goals: Number(latest.goals ?? 0),
        assists: Number(latest.assists ?? 0),
        goalsPerGame: Number(latest.goals_per_game ?? latest.goalsPerGame ?? 0),
        shotsPerGame: Number(latest.shots_per_game ?? latest.shotsPerGame ?? 0),
        scoringPerMinute: Number(latest.scoring_per_minute ?? 0),
        touchesPerGame: Number(
          latest.touches_per_game ?? latest.touchesPerGame ?? 0,
        ),
        bigChancesCreated: Number(latest.big_chances_created ?? 0),
        keyPassesPerGame: Number(latest.key_passes_per_game ?? 0),

        // defending
        interceptionsPerGame: Number(latest.interceptions_per_game ?? 0),
        tacklesPerGame: Number(latest.tackles_per_game ?? 0),
        ballsRecovered: Number(latest.balls_recovered ?? 0),
        penaltiesCommitted: Number(latest.penalties_committed ?? 0),

        // snake_case fallbacks
        goals_per_game: Number(latest.goals_per_game ?? 0),
        shots_per_game: Number(latest.shots_per_game ?? 0),
        scoring_per_minute: Number(latest.scoring_per_minute ?? 0),
        touches_per_game: Number(latest.touches_per_game ?? 0),
        big_chances_created: Number(latest.big_chances_created ?? 0),
        key_passes_per_game: Number(latest.key_passes_per_game ?? 0),
        interceptions_per_game: Number(latest.interceptions_per_game ?? 0),
        tackles_per_game: Number(latest.tackles_per_game ?? 0),
        balls_recovered: Number(latest.balls_recovered ?? 0),
        penalties_committed: Number(latest.penalties_committed ?? 0),
      },
    },
  ];

  return (
    <main>
      <div className="profile-stats-tab">
        <div className="info-tab-header">
          {isMe && (
            <Button
              size="medium"
              type="outline"
              Icon={EditIcon}
              className="edit-info-btn"
              onClick={() => (window.location.href = "/edit-profile")}
            />
          )}
        </div>

        <section className="player-infograph">
          <div className="season-summary">
            <div className="season-summary__left">
              <div className="season-summary__tag">Season</div>
              <div className="season-summary__year">{latest.label || "—"}</div>
            </div>

            <div className="season-summary__kpis">
              <div className="ss-kpi ss-kpi--matches">
                <div className="ss-kpi__value">
                  {Number(latest.matches ?? 0)}
                </div>
                <div className="ss-kpi__label">Matches</div>
              </div>

              <div className="ss-kpi ss-kpi--goals">
                <div className="ss-kpi__value">{Number(latest.goals ?? 0)}</div>
                <div className="ss-kpi__label">Goals</div>
              </div>

              <div className="ss-kpi ss-kpi--assists">
                <div className="ss-kpi__value">
                  {Number(latest.assists ?? 0)}
                </div>
                <div className="ss-kpi__label">Assists</div>
              </div>
            </div>
          </div>
          <SeasonInfograph
            seasonLabel={seasons[seasons.length - 1]?.label}
            series={seasons}
            onSelect={(idx) => setSelectedSeasonIndex(idx)}
          />
        </section>

        <section className="player-stats">
          <div className="stats-grid">
            <TableStats players={players} />

            <TableAttacking players={players} />

            <TableDefending players={players} />

            <TablePassing players={players} />
          </div>
        </section>
      </div>
    </main>
  );
}
