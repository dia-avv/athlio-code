import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../lib/supabase";
import SearchBarCard from "../../../components/domain/Scouting/SearchBarCard";

export default function FollowingPage() {
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let ignore = false;

    async function loadFollowing() {
      const { data: auth } = await supabase.auth.getUser();
      const user = auth?.user;

      if (!user) {
        navigate("auth", { replace: true });
        return;
      }

      const { data, error } = await supabase
        .from("follows")
        .select(
          `
          following_id,
          profiles:following_id (
            id,
            full_name,
            avatar_url,
            country,
            club_other_name,
            club_id
          )
        `,
        )
        .eq("follower_id", user.id);

      if (error) {
        console.error("Error loading following:", error);
        setFollowing([]);
      } else if (!ignore) {
        setFollowing(data.map((f) => f.profiles));
      }

      if (!ignore) setLoading(false);
    }

    loadFollowing();
    return () => {
      ignore = true;
    };
  }, [navigate]);

  // ✅ make sure these returns are *inside the component*
  if (loading) {
    return <div className="page">Loading...</div>;
  }

  return (
    <div className="page following-page">
      <h2 className="following-title">Following</h2>

      {following.length === 0 ? (
        <p>You’re not following anyone yet.</p>
      ) : (
        <div className="following-list">
          {following.map((profile) => (
            <SearchBarCard
              key={profile.id}
              profileId={profile.id}
              onSelect={() => navigate(`/profile/${profile.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
