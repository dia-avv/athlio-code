// This is for redirecting users back to the app after authentication with Google or Apple

import { useEffect } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../../lib/supabase";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    async function finishLogin() {
      const { data: sessionData, error } = await supabase.auth.getSession();
      if (error) {
        navigate("/auth");
        return;
      }

      const user = sessionData?.session?.user;
      if (!user) {
        navigate("/auth");
        return;
      }

      // First-login heuristic: brand-new accounts have equal timestamps
      const firstLogin =
        user?.created_at &&
        user?.last_sign_in_at &&
        new Date(user.created_at).getTime() ===
          new Date(user.last_sign_in_at).getTime();

      // Ensure a profile row exists either way
      await supabase
        .from("profiles")
        .upsert({ id: user.id }, { onConflict: "id" });

      if (firstLogin) {
        // brand new user → go to setup
        navigate("/setup-profile");
        return;
      }

      // Not first login → try to read profile and decide
      const { data: existingProfile, error: selectErr } = await supabase
        .from("profiles")
        .select("id, full_name") // include the field you consider "completed"
        .eq("id", user.id)
        .maybeSingle();

      if (selectErr) {
        // if RLS blocks select, safest is to send to setup
        navigate("/setup-profile");
        return;
      }

      // If profile looks incomplete (e.g., missing name), send to setup
      const incomplete = !existingProfile?.full_name;
      navigate(incomplete ? "setup-profile" : "home");
    }

    finishLogin();
  }, [navigate]);

  return <p>Finishing sign-in...</p>;
}
