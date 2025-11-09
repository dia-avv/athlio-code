import { useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../../lib/supabase";
import TextInput from "../../components/inputs/TextInput";
import Button from "../../components/UI/Button";


const OAUTH_REDIRECT = window.location.origin + "/auth/callback";

async function signInWithGoogle(setErr) {
  setErr("");
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: OAUTH_REDIRECT,
      queryParams: { prompt: "select_account" },
    },
  });
  if (error) setErr(error.message);
}

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
      });
      if (error) return setErr(error.message);

      const uid =
        data?.user?.id || (await supabase.auth.getUser()).data?.user?.id;

      if (uid) {
        await supabase
          .from("profiles")
          .upsert({ id: uid }, { onConflict: "id" });
      }

      return navigate("/setup-profile", { replace: true });
    }

    const { data: loginData, error: loginErr } =
      await supabase.auth.signInWithPassword({ email, password });
    if (loginErr) return setErr(loginErr.message);

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
        <h1 className="h1">
          {mode === "signup" ? "Create account" : "Log in to an account"}
        </h1>
        <p style={{ color: "var(--color-gray-700)" }}>
          {mode === "signup"
            ? "Create an account and get access to the biggest database of athletes. Enter your email and password."
            : "Log in to your account to access the biggest database of athletes. Enter your email and password."}
        </p>


        {/* ✅ Using TextInput for email */}
        <TextInput
          label="Email"
          placeholder="Enter your email"
          name="email"
          value={email}
          onChange={setEmail}
        />

        {/* ✅ Using TextInput for password */}
        <TextInput
          label="Password"
          placeholder="Enter your password"
          name="password"
          type="password"
          value={password}
          onChange={setPassword}
        />

        {err && <p className="text-red-600 text-sm">{err}</p>}

        <Button
          size="big"
          type="primary"
          label={mode === "signup" ? "Sign up" : "Log in"}
          onClick={submit}
        />

        <button
          type="button"
          className="text-sm underline"
          onClick={() => setMode((m) => (m === "signup" ? "login" : "signup"))}
        >
          {mode === "signup"
            ? "I already have an account"
            : "Create a new account"}
        </button>

        <div>
          <div>
            <div />
            <span>or</span>
            <div />
          </div>

          <div>
            <Button size="big" type="outline" label="Continue with Google" onClick={() => signInWithGoogle(setErr)} />
          </div>
        </div>
      </form>
    </div>
  );
}
