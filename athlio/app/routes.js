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
    route("auth/callback", "routes/onboarding/auth-callback.jsx"),

    // your actual app screens
    route("home", "routes/home.jsx"),
    route("profile/me", "routes/profile/me.jsx"),
    route("profile/me/edit", "routes/profile/me/edit.jsx"),
    route("profile/me/following", "routes/profile/me/following.jsx"),
    route("profile/:id", "routes/profile/other.jsx"),

    route("notifications", "routes/notifications.jsx"),
    route("add-post", "routes/add-post/layout.jsx", [
      index("routes/add-post/index.jsx"), // maybe redirect or show picker
      route("post", "routes/add-post/post.jsx"),
      route("match", "routes/add-post/match.jsx"),
      route("activity", "routes/add-post/activity.jsx"),
      route("event", "routes/add-post/event.jsx"),
    ]),
    route("chat", "routes/chat.jsx"),
    route("scouting", "routes/scouting.jsx"),
  ]),
];
