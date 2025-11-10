import { Outlet, useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { fetchProfiles, fetchSeasonStats } from "../../lib/stats";
import { fetchPlayerInfo } from "../../lib/info";
import { fetchExperiences } from "../../lib/experiences";
import { fetchInjuries } from "../../lib/injuries";

export default function ScoutingLayout() {
  const [activeTab, setActiveTab] = useState("stats");
  const [season, setSeason] = useState("all");
  const [selectedPlayerIds, setSelectedPlayerIds] = useState([]);
  const [players, setPlayers] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
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
    const params = new URLSearchParams(location.search);
    const toAdd = params.get("add");
    if (toAdd) {
      handleAddPlayer(toAdd);
      navigate("/scouting", { replace: true });
    }
  }, [location.search]);

  function handleAddPlayer(newPlayerId) {
    setSelectedPlayerIds((prev) => {
      if (prev.length >= 3) return prev;
      if (!newPlayerId || prev.includes(newPlayerId)) return prev;
      return [...prev, newPlayerId];
    });
  }

  function handleRemovePlayer(playerId) {
    setSelectedPlayerIds((prev) => {
      if (!playerId) {
        if (prev.length <= 1) return prev;
        return prev.slice(0, -1);
      }
      return prev.filter((id) => id !== playerId);
    });
  }

  function handleSeasonChange(label) {
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
