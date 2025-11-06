import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import Topbar from "../../components/Topbar";
import ProfileHeader from "../../components/domain/Profile/ProfileHeader";
import { isFollowing, follow, unfollow } from "../../lib/follows";

export default function OtherProfile() {
  const { id } = useParams(); // profile id (uuid)
  if (!id) return <div className="page">Invalid profile route.</div>;

  const [state, setState] = useState("loading");
  const [profile, setProfile] = useState(null);
  const [meId, setMeId] = useState(null);
  const [isFollowingState, setIsFollowing] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let ignore = false;
    (async () => {
      setState("loading");

      // Logged-in user
      const { data: auth } = await supabase.auth.getUser();
      const user = auth?.user ?? null;
      if (user && !ignore) setMeId(user.id);

      // Fetch target profile
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        console.error("[OtherProfile] profile fetch error:", error);
        setState("error");
        return;
      }

      if (!data) {
        setState("notfound");
        return;
      }

      setProfile(data);

      // Prefetch follow state
      if (user) {
        try {
          const following = await isFollowing(data.id);
          if (!ignore) setIsFollowing(following);
        } catch (err) {
          console.error("isFollowing check failed:", err);
        }
      }

      setState("ready");
    })();

    return () => {
      ignore = true;
    };
  }, [id]);

  async function toggleFollow() {
    if (!meId || !profile || busy) return;
    setBusy(true);

    const next = !isFollowingState;
    setIsFollowing(next);

    try {
      if (next) {
        await follow(profile.id);
      } else {
        await unfollow(profile.id);
      }

      // Wait a moment for DB trigger to update counts
      await new Promise((r) => setTimeout(r, 300));

      // Re-fetch updated profile
      const { data: updatedProfile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", profile.id)
        .single();

      if (error) {
        console.error("Error fetching updated profile:", error);
      } else {
        setProfile(updatedProfile);
      }
    } catch (err) {
      console.error("Toggle follow error:", err);
      setIsFollowing(!next); // revert on failure
    } finally {
      setBusy(false);
    }
  }

  if (state === "loading") return <div className="page">Loading…</div>;
  if (state === "notfound")
    return <div className="page">Profile not found.</div>;
  if (state === "error") return <div className="page">Something broke.</div>;
  if (!profile) return null;

  const canFollow = meId && meId !== profile.id;

  return (
    <div className="page profile other">
      <Topbar />
      <ProfileHeader
        profile={profile}
        isMe={!canFollow}
        isFollowing={isFollowingState}
        toggleFollow={toggleFollow}
        busy={busy}
      />
    </div>
  );
}
