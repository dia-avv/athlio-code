import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let mounted = true;
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (mounted) {
        setProfile(data || null);
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);
  return { profile, loading, setProfile };
}
