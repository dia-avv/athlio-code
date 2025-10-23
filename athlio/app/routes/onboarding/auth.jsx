import { useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../../lib/supabase";

export default function Auth() {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setErr("");

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        // emailRedirectTo not needed with confirm email OFF in dev
        // options: { emailRedirectTo: "http://localhost:5173/auth" },
      });
      if (error) return setErr(error.message);

      // With confirm email OFF, we have a session now. Ensure a profiles row exists.
      const uid =
        data?.user?.id || (await supabase.auth.getUser()).data?.user?.id;

      if (uid) {
        await supabase
          .from("profiles")
          .upsert({ id: uid }, { onConflict: "id" });
      }

      return navigate("/setup-profile", { replace: true });
    }

    // login path
    const { data: loginData, error: loginErr } =
      await supabase.auth.signInWithPassword({ email, password });
    if (loginErr) return setErr(loginErr.message);

    // Belt-and-suspenders: ensure a profiles row exists after login too
    const uid =
      loginData?.user?.id || (await supabase.auth.getUser()).data?.user?.id;

    if (uid) {
      await supabase.from("profiles").upsert({ id: uid }, { onConflict: "id" });
    }

    navigate("/home", { replace: true });
  }

  return (
    <div className="min-h-dvh grid place-items-center p-6">
      <form onSubmit={submit} className="w-full max-w-sm space-y-3">
        <h2 className="text-2xl font-semibold">
          {mode === "signup" ? "Create account" : "Welcome back"}
        </h2>

        <input
          className="w-full border rounded px-3 py-2"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full border rounded px-3 py-2"
          placeholder="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {err && <p className="text-red-600 text-sm">{err}</p>}

        <button className="w-full bg-black text-white py-2 rounded">
          {mode === "signup" ? "Sign up" : "Log in"}
        </button>

        <button
          type="button"
          className="text-sm underline"
          onClick={() => setMode((m) => (m === "signup" ? "login" : "signup"))}
        >
          {mode === "signup"
            ? "I already have an account"
            : "Create a new account"}
        </button>
      </form>
    </div>
  );
}
