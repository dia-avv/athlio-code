import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Player from "../../../assets/images/player.jpg";

import { supabase } from "../../../lib/supabase";
import ProfilePicture from "../../../components/UI/ProfilePicture";

export default function FollowingListPage() {
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      // Get current logged-in user
      const { data: auth } = await supabase.auth.getUser();
      const user = auth?.user;
      if (!user) {
        navigate("/auth", { replace: true });
        return;
      }

      // Fetch list of profiles the user follows
      const { data, error } = await supabase
        .from("follows")
        .select(
          `
          following_id,
          profiles:following_id (
            id,
            full_name,
            username,
            role,
            avatar_url
          )
        `,
        )
        .eq("follower_id", user.id);

      if (error) {
        console.error("Error fetching following list:", error);
        setFollowing([]);
      } else {
        setFollowing(data.map((item) => item.profiles));
      }

      setLoading(false);
    })();
  }, [navigate]);

  if (loading) return <div className="page">Loading...</div>;

  if (following.length === 0)
    return <div className="page">You’re not following anyone yet.</div>;

  return (
    <div className="page following-list">
      <h2 className="following-title">Following</h2>

      <div className="following-items">
        {following.map((p) => (
          <div
            key={p.id}
            className="following-item"
            onClick={() => navigate(`/profile/${p.id}`)}
          >
            <ProfilePicture imgUrl={Player} size="medium" />
            <div className="following-info">
              <p className="following-name">{p.full_name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
