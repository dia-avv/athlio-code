import { index, route } from "@react-router/dev/routes";

export default [
  route("/", "routes/layout.jsx", [
    // landing gate
    index("routes/onboarding/landing.jsx"),

    // onboarding
    route("intro", "routes/onboarding/intro.jsx"),

    // login/signup
    route("auth", "routes/onboarding/auth.jsx"),
    route("setup-profile", "routes/onboarding/setup-profile.jsx"),

    // your actual app screens
    route("home", "routes/home.jsx"),
    route("profile", "routes/profile.jsx"),
    route("notifications", "routes/notifications.jsx"),
    route("new-post", "routes/new-post.jsx"),
    route("chat", "routes/chat.jsx"),
    route("scouting", "routes/scouting.jsx"),
  ]),
];
