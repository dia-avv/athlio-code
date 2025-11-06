import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";
import MatchCard from "../../Post/MatchCard";
import "./MatchesTab.css";

export default function MatchesTab({ profile }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!profile?.id) return;

      setLoading(true);
      setError(null);

      // ✅ Fetch all posts of type 'match' authored by this profile
      const { data, error } = await supabase
        .from("posts")
        .select(
          `
          id,
          type,
          content,
          media,
          created_at,
          goals,
          assists,
          minutes_played,
          date_of_game,
          league,
          your_team,
          opponent,
          your_score,
          opponent_score,
          author_id
        `,
        )
        .eq("author_id", profile.id)
        .eq("type", "match") // only match posts
        .order("created_at", { ascending: false });

      if (cancelled) return;

      if (error) {
        console.error("Error loading match posts:", error);
        setError(error.message);
      } else {
        // ✅ Always render without images (even if `media` exists)
        const noImageMatches = (data || []).map((m) => ({
          ...m,
          media: null,
        }));
        setMatches(noImageMatches);
      }

      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [profile?.id]);

  if (loading) return <p>Loading matches…</p>;
  if (error) return <p className="error">Failed to load matches: {error}</p>;
  if (!matches.length) return <p>No match posts yet.</p>;

  return (
    <main>
      <div className="profile-matches-tab">
        {matches.map((m) => (
          <MatchCard
            key={m.id}
            isImage={false} // ✅ always false
            imageUrl={null} // ✅ no image shown
            yourTeam={m.your_team}
            yourScore={m.your_score}
            opponent={m.opponent}
            opponentScore={m.opponent_score}
            league={m.league}
            date={m.date_of_game}
            goalsCount={m.goals}
            assistsCount={m.assists}
            minCount={m.minutes_played}
          />
        ))}
      </div>
    </main>
  );
}
