// Scouting layout: manages selected players, season/tab state,
// fetches combined player data, and exposes it via Outlet context.
import { Outlet, useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { fetchProfiles, fetchSeasonStats } from "../../lib/stats";
import { fetchPlayerInfo } from "../../lib/info";
import { fetchExperiences } from "../../lib/experiences";
import { fetchInjuries } from "../../lib/injuries";

export default function ScoutingLayout() {
  // UI state
  const [activeTab, setActiveTab] = useState("stats");
  const [season, setSeason] = useState("all");
  // Up to 3 player IDs to compare
  const [selectedPlayerIds, setSelectedPlayerIds] = useState([]);
  // Aggregated player view-model for children
  const [players, setPlayers] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Load and merge player data when selection/season changes.
    // Uses a cancellation flag to avoid setting state after unmount/rerender.
    let cancelled = false;
    (async () => {
      if (!selectedPlayerIds.length) {
        setPlayers([]);
        return;
      }
      try {
        const [profiles, stats, infoRows, experienceRows, injuryRows] = await Promise.all([
          fetchProfiles(selectedPlayerIds),
          fetchSeasonStats(selectedPlayerIds, { season }),
          fetchPlayerInfo(selectedPlayerIds, { season }),
          fetchExperiences(selectedPlayerIds),
          fetchInjuries(selectedPlayerIds),
        ]);

        const statByPlayer = new Map(stats.map((s) => [s.profile_id, s.stats]));
        const infoByPlayer = new Map(infoRows.map((row) => [row.profile_id, row.info]));
        const expByPlayer = new Map(
          experienceRows.map((row) => [row.profile_id, row.experiences])
        );
        const injuriesByPlayer = new Map(
          injuryRows.map((row) => [row.profile_id, row.injuries])
        );
        const merged = selectedPlayerIds
          .map((id) => {
            const p = profiles.find((x) => x.id === id);
            const info = { ...(infoByPlayer.get(id) || {}) };
            // Fallbacks for team name/logo if info is incomplete
            if (!info.teamName) {
              info.teamName = p?.club_other_name || p?.club?.name || null;
            }
            if (!info.teamLogo) {
              info.teamLogo = p?.club?.logo_url || null;
            }
            return {
              id,
              name: p?.full_name || "Player",
              avatar: p?.avatar_url || null,
              info: Object.keys(info).length ? info : null,
              experiences: expByPlayer.get(id) || [],
              injuries: injuriesByPlayer.get(id) || [],
              stats:
                statByPlayer.get(id) ?? {
                  totalPlayed: 0,
                  started: 0,
                  minutesPerGame: 0,
                  totalMinutes: 0,
                },
            };
          })
          .slice(0, 3);
        if (!cancelled) setPlayers(merged);
      } catch (e) {
        console.error("load scouting stats", e);
        // Graceful fallback to placeholder players on error
        if (!cancelled)
          setPlayers(
            selectedPlayerIds.slice(0, 3).map((id) => ({
              id,
              name: "Player",
              avatar: null,
              info: null,
              experiences: [],
              injuries: [],
              stats: {
                totalPlayed: 0,
                started: 0,
                minutesPerGame: 0,
                totalMinutes: 0,
              },
            })),
          );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedPlayerIds, season]);

  useEffect(() => {
    // Support adding a player via `?add=<playerId>` and then clean URL.
    const params = new URLSearchParams(location.search);
    const toAdd = params.get("add");
    if (toAdd) {
      handleAddPlayer(toAdd);
      navigate("/scouting", { replace: true });
    }
  }, [location.search]);

  function handleAddPlayer(newPlayerId) {
    // Add a player (max 3, ignore duplicates/empty)
    setSelectedPlayerIds((prev) => {
      if (prev.length >= 3) return prev;
      if (!newPlayerId || prev.includes(newPlayerId)) return prev;
      return [...prev, newPlayerId];
    });
  }

  function handleRemovePlayer(playerId) {
    // Remove a specific player or the last one when no id is provided.
    setSelectedPlayerIds((prev) => {
      if (!playerId) {
        if (prev.length <= 1) return prev;
        return prev.slice(0, -1);
      }
      return prev.filter((id) => id !== playerId);
    });
  }

  function handleSeasonChange(label) {
    // Normalize incoming labels like "2023-24" / "2023/24" to "2023-24".
    if (!label || label === "all") {
      setSeason("all");
      return;
    }
    const m = String(label).match(/(\d{4})[-/–](\d{2})/);
    if (m) {
      setSeason(`${m[1]}-${m[2]}`);
    } else {
      setSeason(label);
    }
  }

  // Context exposed to nested scouting routes via Outlet
  const context = {
    players,
    activeTab,
    setActiveTab,
    handleAddPlayer,
    handleRemovePlayer,
    handleSeasonChange,
  };

  return <Outlet context={context} />;
}
