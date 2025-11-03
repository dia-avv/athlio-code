import "./Feed.css";
import { useEffect, useState } from "react";
import BasicPost from "../domain/Post/BasicPost";
import MatchPost from "../domain/Post/MatchPost";
import { supabase } from "../../lib/supabase";
// adjust this path if your context sits elsewhere
import { useUser } from "../../context/UserContext";

function PostSwitcher({ post }) {
  // prefer joined profile data if present
  const prof = post.profiles || {};
  const club = prof.club || {};

  const rawDate = post.created_at || post.createdAt || "";
  const formattedDate = rawDate
    ? new Date(rawDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      })
    : "";

  const common = {
    id: post.id,
    author: prof.full_name || prof.username || post.author || "",
    authorId: prof.id || post.author_id || "",
    position: prof.position || "",
    createdAt: formattedDate,
    club: club,
  };

  if (post.type === "match") {
    return (
      <MatchPost
        {...common}
        content={post.content ?? ""}
        imageUrl={post.media || ""}
        goalsCount={Number(post.goals) || 0}
        assistsCount={Number(post.assists) || 0}
        minCount={Number(post.minutes_played) || 0}
        date={post.date_of_game ?? ""}
        league={post.league ?? ""}
        opponent={post.opponent ?? ""}
        yourScore={Number(post.your_score) || 0}
        opponentScore={Number(post.opponent_score) || 0}
        yourTeam={club.name}
      />
    );
  }

  // default basic post
  return (
    <BasicPost
      {...common}
      content={post.content ?? ""}
      imageUrl={post.media || undefined}
      yourTeam={club.name}
    />
  );
}

export default function Feed() {
  const { user, loading: userLoading } = useUser();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      // wait for context to resolve
      if (userLoading) return;

      // no user = empty feed
      if (!user) {
        if (!cancelled) {
          setPosts([]);
          setLoading(false);
        }
        return;
      }

      // 1) who do I follow
      const { data: followRows, error: followErr } = await supabase
        .from("follows")
        .select("following_id")
        .eq("follower_id", user.id);

      if (cancelled) return;

      if (followErr) {
        setError(followErr.message);
        setLoading(false);
        return;
      }

      const followingIds = (followRows || []).map((r) => r.following_id);

      if (followingIds.length === 0) {
        // optional: fallback to global posts for empty feed
        setPosts([]);
        setLoading(false);
        return;
      }

      // 2) posts by followed authors, with joined profile fields
      const { data: postRows, error: postsErr } = await supabase
        .from("posts")
        .select(
          `*, profiles:author_id (id, full_name, username, role, position, avatar_url, club_id, club:club_id (id, name, logo_url))`,
        )
        .in("author_id", followingIds)
        .order("created_at", { ascending: false })
        .limit(50);

      if (cancelled) return;

      if (postsErr) {
        setError(postsErr.message);
      } else {
        setPosts(Array.isArray(postRows) ? postRows : []);
      }
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [user, userLoading]);

  if (userLoading || loading) return <p>Loading feed…</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="posts-feed">
      {posts.map((p) => (
        <PostSwitcher key={p.id} post={p} />
      ))}
    </div>
  );
}
