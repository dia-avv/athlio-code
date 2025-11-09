import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useSession() {
  const [session, setSession] = useState(null);
  useEffect(() => {
    let mounted = true;
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (mounted) setSession(session);
    })();
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) =>
      setSession(s),
    );
    return () => sub.subscription.unsubscribe();
  }, []);
  return session;
}
