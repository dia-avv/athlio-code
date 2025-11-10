import { redirect } from "react-router";
import { supabase } from "../../lib/supabase";

export async function clientLoader() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) return redirect("/home");

  const seen = localStorage.getItem("introSeen") === "true";
  return redirect(seen ? "/auth" : "/intro");
}

export default function LandingGate() {
  console.log("Supabase URL:", import.meta.env.VITE_SUPABASE_URL);
  return null;
}
