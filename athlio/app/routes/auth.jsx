import { useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../lib/supabase";

export default function Auth() {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setErr("");

    const run =
      mode === "signup"
        ? () => supabase.auth.signUp({ email, password })
        : () => supabase.auth.signInWithPassword({ email, password });

    const { error } = await run();
    if (error) return setErr(error.message);

    navigate("/home" /*{ replace: true }*/); // session exists now
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
