// routes/onboarding/landing.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { redirect } from "react-router";
import { supabase } from "../../lib/supabase";

// 1) Keep the loader (SPA requires `clientLoader`), but make it safe
export async function clientLoader() {
  try {
    // guard window-only APIs in case something compiles weirdly
    const seen =
      typeof window !== "undefined" &&
      localStorage.getItem("introSeen") === "true";

    const { data } = await supabase.auth.getSession();
    const hasSession = !!data?.session;

    return redirect(hasSession ? "/home" : seen ? "/auth" : "/intro");
  } catch {
    // failsafe so the route never renders blank
    return redirect("/auth");
  }
}

// 2) Component fallback: if the loader somehow doesn't fire, push anyway
export default function LandingGate() {
  const navigate = useNavigate();

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const seen =
          typeof window !== "undefined" &&
          localStorage.getItem("introSeen") === "true";

        const { data } = await supabase.auth.getSession();
        const hasSession = !!data?.session;
        const to = hasSession ? "/home" : seen ? "/auth" : "/intro";
        if (alive) navigate(to, { replace: true });
      } catch {
        if (alive) navigate("/auth", { replace: true });
      }
    })();

    return () => {
      alive = false;
    };
  }, [navigate]);

  return <div style={{ padding: 16 }}>Loading…</div>;
}
