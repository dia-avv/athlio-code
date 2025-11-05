import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";

function isUuid(v) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    v,
  );
}

export default function OtherProfile() {
  const { userKey } = useParams(); // handle or uuid
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

      // fetch target profile by id OR handle
      const query = supabase.from("profiles").select("*").limit(1);
      const { data, error } = isUuid(userKey)
        ? await query.eq("id", userKey).single()
        : await query.eq("handle", userKey).single();

      if (ignore) return;
      if (error || !data) {
        setState("notfound");
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
  }, [userKey]);

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

  return <div className="page profile other"></div>;
}
