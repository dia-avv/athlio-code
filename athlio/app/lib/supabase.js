// app/lib/supabase.js (or wherever you create the client)
import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  // Don’t crash the whole app. Show a clear message in console.
  console.error(
    "[Athlio] Missing Supabase env vars. Check GH Pages build env.",
  );
}

export const supabase = url && key ? createClient(url, key) : null;
