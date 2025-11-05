import { index, route } from "@react-router/dev/routes";

export default [
  route("/", "routes/layout.jsx", [
    // landing gate
    index("routes/landing.jsx"),

    // onboarding
    route("intro", "routes/intro.jsx"),

    // login/signup
    route("auth", "routes/auth.jsx"),

    // your actual app screens
    route("home", "routes/home.jsx"),
    route("me", "routes/profile/me.jsx"),
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
