import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import Topbar from "../../components/Topbar";

export default function MyProfile() {
  const [state, setState] = useState("loading"); // loading | ready | unauth | error | notfound
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    let ignore = false;

    (async () => {
      setState("loading");

      // 1) who am I
      const { data: auth, error: authErr } = await supabase.auth.getUser();
      const user = auth?.user ?? null;
      if (authErr || !user) {
        if (!ignore) setState("unauth");
        return;
      }

      // 2) load my profile by id
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (ignore) return;

      if (error) {
        setState(error.code === "PGRST116" ? "notfound" : "error");
        return;
      }

      setProfile(data);
      setState("ready");
    })();

    return () => {
      ignore = true;
    };
  }, []);

  if (state === "unauth") return <Navigate to="/auth" replace />;
  if (state === "loading") return <div className="page">Loading…</div>;
  if (state === "notfound")
    return <div className="page">Your profile isn’t set up yet.</div>;
  if (state === "error")
    return <div className="page">Couldn’t load your profile.</div>;
  if (!profile) return null;

  return (
    <div className="page profile self">
      <Topbar />
    </div>
  );
}
