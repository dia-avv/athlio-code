import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export default function OtherProfile() {
  const { id } = useParams(); // profile id (uuid)
  if (!id) return <div className="page">Invalid profile route.</div>;
  const [state, setState] = useState("loading"); // loading | ready | notfound | error
  const [profile, setProfile] = useState(null);
  const [meId, setMeId] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let ignore = false;
    (async () => {
      setState("loading");

      //currently logged in user - useful to check if one user follows the other
      const { data: auth } = await supabase.auth.getUser();
      const user = auth?.user ?? null;
      if (user && !ignore) setMeId(user.id);

      // fetch target profile strictly by id
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      console.debug("[OtherProfile] lookup", { id, mode: "by-id" });
      if (error) console.error("[OtherProfile] profile fetch error:", error);

      if (!data) {
        setState("notfound");
        return;
      }
      if (error) {
        setState("error");
        return;
      }

      setProfile(data);

      // prefetch follow state if logged in
      if (user) {
        const { data: f } = await supabase
          .from("follows")
          .select("id")
          .eq("follower_id", user.id)
          .eq("followed_id", data.id)
          .maybeSingle();
        if (!ignore) setIsFollowing(!!f);
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
    const next = !isFollowing;
    setIsFollowing(next);
    try {
      if (next) {
        await supabase
          .from("follows")
          .insert({ follower_id: meId, followed_id: profile.id });
      } else {
        await supabase
          .from("follows")
          .delete()
          .eq("follower_id", meId)
          .eq("followed_id", profile.id);
      }
    } catch {
      setIsFollowing(!next); // revert on fail
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
      <h2>
        {profile.display_name ||
          profile.full_name ||
          profile.username ||
          "Profile"}
      </h2>
      <p>@{profile.username || profile.id}</p>
      {canFollow && (
        <button onClick={toggleFollow} disabled={busy}>
          {isFollowing ? "Unfollow" : "Follow"}
        </button>
      )}
    </div>
  );
}
