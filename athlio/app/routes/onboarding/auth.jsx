import { useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../../lib/supabase";
import TextInput from "../../components/inputs/TextInput";
import Button from "../../components/UI/Button";
import GoogleIcon from "../../assets/logos/Google.svg?react";
import MainLogoSmall from "../../assets/logos/main-logo-small.svg?react";

const PROD_REDIRECT = "https://dia-avv.github.io/athlio-code/auth/callback";
const DEV_REDIRECT = "http://localhost:3000/auth/callback";
const OAUTH_REDIRECT =
  process.env.REACT_APP_GOOGLE_REDIRECT_URI ??
  (process.env.NODE_ENV === "production" ? PROD_REDIRECT : DEV_REDIRECT);

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
  const [mode, setMode] = useState("signup"); // "login" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setErr("");

    function formatAuthError(message) {
      if (!message) return "An error occurred";
      // remap common backend messages to friendlier UI text
      if (message.toLowerCase().includes("password") && message.match(/\d+/)) {
        // messages like: "Password should be at least 6 characters"
        return "Password must be at least 6 characters";
      }
      if (
        message.toLowerCase().includes("missing email") ||
        message.toLowerCase().includes("missing email or phone")
      ) {
        return "Please enter your email";
      }
      return message;
    }

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) return setErr(formatAuthError(error.message));

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
    if (loginErr) return setErr(formatAuthError(loginErr.message));

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
        {/* Figma icon (wrapped) */}
        <div
          style={{
            background: "var(--color-gray-100)",
            padding: 0,
            borderRadius: 12,
            width: 52,
            height: 52,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 12,
          }}
        >
          <MainLogoSmall
            aria-hidden="true"
            style={{ width: 32, height: 32 }}
          />
        </div>

        <h1 className="h1">
          {mode === "signup" ? "Create account" : "Log in to an account"}
        </h1>
        <p style={{ color: "var(--color-gray-700)" }}>
          {mode === "signup"
            ? "Create an account and get access to the biggest database of athletes. Enter your email and password."
            : "Log in to your account to access the biggest database of athletes. Enter your email and password."}
        </p>

        {/* ✅ Using TextInput for email + password (24px gap). Added marginTop to match Figma spacing */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            marginTop: 28,
          }}
        >
          <TextInput
            label="Email"
            placeholder="Enter your email"
            name="email"
            value={email}
            onChange={setEmail}
          />

          <TextInput
            label="Password"
            placeholder="Enter your password"
            name="password"
            type="password"
            value={password}
            onChange={setPassword}
          />
        </div>

        {err && <p className="text-red-600 text-sm">{err}</p>}

        <div style={{ marginTop: 32 }}>
          <Button
            size="big"
            type="primary"
            label={mode === "signup" ? "Sign up" : "Log in"}
            onClick={submit}
          />
        </div>

        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              margin: "16px 0",
            }}
          >
            <div
              style={{
                flex: 1,
                height: "1px",
                backgroundColor: "#d1d5db",
              }}
            ></div>
            <span
              style={{
                margin: "0 24px",
                color: "#6b7280",
                fontSize: "14px",
                whiteSpace: "nowrap",
              }}
            >
              or
            </span>
            <div
              style={{
                flex: 1,
                height: "1px",
                backgroundColor: "#d1d5db",
              }}
            ></div>
          </div>

          <div>
            <Button
              size="big"
              type="outline"
              label="Continue with Google"
              Icon={GoogleIcon}
              onClick={() => signInWithGoogle(setErr)}
            />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            marginTop: 8,
            flexWrap: "wrap",
          }}
        >
          <p style={{ color: "var(--color-gray-700)", margin: 0 }}>
            {mode === "signup"
              ? "I already have an account"
              : "Don't have an account?"}
          </p>
          <Button
            type="subtle"
            size="medium"
            label={mode === "signup" ? "Log in" : "Sign up"}
            onClick={() =>
              setMode((m) => (m === "signup" ? "login" : "signup"))
            }
          />
        </div>
      </form>
    </div>
  );
}
