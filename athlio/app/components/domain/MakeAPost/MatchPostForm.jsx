import { useEffect, useState } from "react";
import TextInput from "../../inputs/TextInput";
import ClubPicker from "../onboarding/ClubPicker";
import { supabase } from "../../../lib/supabase";

async function resolveClubName(club) {
  if (!club) return null;
  if (club.club_other_name && club.club_other_name.trim()) {
    return club.club_other_name.trim();
  }
  if (club.club_id) {
    const { data, error } = await supabase
      .from("clubs")
      .select("name")
      .eq("id", club.club_id)
      .single();
    if (!error && data?.name) return data.name;
  }
  return null;
}

export default function MatchPostForm({ onCreated }) {
  const [saving, setSaving] = useState(false);
  const [meId, setMeId] = useState(null);

  // keep visual structure intact; just make it controlled
  const [form, setForm] = useState({
    primarySport: "football",
    league: "",
    location: "",
    date_of_game: "", // optional for now, can be wired to a date picker later

    // your team
    your_team: { club_id: null, club_other_name: null },
    // opponent team
    opponent_team: { club_id: null, club_other_name: null },

    // score & stats
    your_score: 0,
    opponent_score: 0,
    minutes_played: 0,
    goals: 0,
    assists: 0,
  });

  // handy patch setter
  function patch(update) {
    setForm((f) => ({ ...f, ...update }));
  }

  // who am I (in case posts.author_id is required or RLS needs it)
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      setMeId(data?.user?.id || null);
    })();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (saving) return;
    setSaving(true);

    try {
      const yourTeamName = await resolveClubName(form.your_team);
      const opponentName = await resolveClubName(form.opponent_team);

      // Build row for `posts` table. Adjust keys to your exact schema names.
      const row = {
        type: "match",
        league: form.league?.trim() || null,
        location: form.location?.trim() || null,
        date_of_game: form.date_of_game || null,

        // team names (posts table has no club id columns)
        your_team: yourTeamName,
        opponent: opponentName,

        // numbers
        your_score: Number(form.your_score) || 0,
        opponent_score: Number(form.opponent_score) || 0,
        minutes_played: Number(form.minutes_played) || 0,
        goals: Number(form.goals) || 0,
        assists: Number(form.assists) || 0,

        // optional author if your schema needs it (remove if handled by DB default)
        author_id: meId || undefined,
        aura_count: 0,
      };

      const { data, error } = await supabase
        .from("posts")
        .insert(row)
        .select("id")
        .single();

      if (error) throw error;

      // notify parent and clear light fields
      onCreated?.(data.id);
      patch({
        league: "",
        location: "",
        date_of_game: "",
        your_score: 0,
        opponent_score: 0,
        minutes_played: 0,
        goals: 0,
        assists: 0,
      });
      // keep selected clubs so user doesn't have to re-pick every time
    } catch (err) {
      console.error("Failed to save match post", err);
      alert(
        "Couldn't save the post. Check console for details and confirm column names in the `posts` table.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="match-post-form-wrapper" onSubmit={handleSubmit}>
      <div className="about-match-section">
        <h2>About the match</h2>
        <div className="inputs-container">
          <TextInput
            label="What league was it?"
            value={form.league}
            onChange={(v) => patch({ league: v })}
          />

          {/* Your team (from your ClubPicker). Do not change the component. */}
          <ClubPicker
            sport={form.primarySport || "football"}
            value={form.your_team}
            onChange={(v) => patch({ your_team: v })}
          />

          {/* Opponent team */}
          <ClubPicker
            sport={form.primarySport || "football"}
            value={form.opponent_team}
            onChange={(v) => patch({ opponent_team: v })}
          />

          <TextInput
            label="Where was the game?"
            value={form.location}
            onChange={(v) => patch({ location: v })}
          />

          {/* Here will be the calendar component */}
          <div className="date-input">
            <label htmlFor="date_of_game">Date of game</label>
            <input
              id="date_of_game"
              type="date"
              value={form.date_of_game}
              onChange={(e) => patch({ date_of_game: e.target.value })}
            />
          </div>

          <div className="score-inputs-container">
            <div className="your-score">
              <p>Your Score*</p>
              <TextInput
                label="Score"
                value={form.your_score}
                onChange={(v) => patch({ your_score: Number(v) || 0 })}
              />
            </div>
            <div className="opponent-score">
              <TextInput
                label="Score"
                value={form.opponent_score}
                onChange={(v) => patch({ opponent_score: Number(v) || 0 })}
              />
              <p>Opponent Score*</p>
            </div>
          </div>
        </div>
      </div>
      <div className="stats-section">
        <TextInput
          label="Minutes Played"
          value={form.minutes_played}
          onChange={(v) => patch({ minutes_played: Number(v) || 0 })}
        />
        <TextInput
          label="Goals"
          value={form.goals}
          onChange={(v) => patch({ goals: Number(v) || 0 })}
        />
        <TextInput
          label="Assists"
          value={form.assists}
          onChange={(v) => patch({ assists: Number(v) || 0 })}
        />
      </div>

      <div style={{ marginTop: 16 }}>
        <button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Post match"}
        </button>
      </div>
    </form>
  );
}
