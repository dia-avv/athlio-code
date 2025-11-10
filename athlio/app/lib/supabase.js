import { createClient } from "@supabase/supabase-js";

let supabase = null;

if (typeof window !== "undefined") {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (url && anonKey) {
    supabase = createClient(url, anonKey);
  } else {
    console.warn("Supabase env vars missing!");
  }
}

export { supabase };
