import { useLocation, Routes, Route, Navigate } from "react-router-dom";

import "./app.css";
import { UserProvider } from "./context/UserContext.jsx";
import Navbar from "./components/Navbar.jsx";
import Topbar from "./components/Topbar.jsx";

// import your pages manually (you already have them in routes/)
import Landing from "./routes/onboarding/landing.jsx";
import Intro from "./routes/onboarding/intro.jsx";
import Auth from "./routes/onboarding/auth.jsx";
import SetupProfile from "./routes/onboarding/setup-profile.jsx";
import AuthCallback from "./routes/onboarding/auth-callback.jsx";

import Home from "./routes/home.jsx";
import ProfileMe from "./routes/profile/me.jsx";
import ProfileEdit from "./routes/profile/me/edit.jsx";
import ProfileFollowing from "./routes/profile/me/following.jsx";
import ProfileOther from "./routes/profile/other.jsx";

import Notifications from "./routes/notifications.jsx";

import AddPostLayout from "./routes/add-post/layout.jsx";
import AddPostIndex from "./routes/add-post/index.jsx";
import AddPostPost from "./routes/add-post/post.jsx";
import AddPostMatch from "./routes/add-post/match.jsx";
import AddPostActivity from "./routes/add-post/activity.jsx";
import AddPostEvent from "./routes/add-post/event.jsx";

import Chat from "./routes/chat.jsx";
import ScoutingLayout from "./routes/scouting/_layout.jsx";
import ScoutingIndex from "./routes/scouting/_index.jsx";
import ScoutingSearch from "./routes/scouting/search.jsx";

function AppShell({ children }) {
  const { pathname } = useLocation();

  // normalize pathname by removing the base ("/athlio-code/")
  const BASE = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
  const path = pathname.startsWith(BASE)
    ? pathname.slice(BASE.length) || "/"
    : pathname;

  const hideNavbar =
    path.startsWith("/auth") ||
    path.startsWith("/intro") ||
    path.startsWith("/setup-profile") ||
    path.startsWith("/add-post");

  const hideTopbar =
    path.startsWith("/auth") ||
    path.startsWith("/intro") ||
    path.startsWith("/setup-profile");

  return (
    <UserProvider>
      {!hideTopbar && <Topbar />}
      {children}
      {!hideNavbar && <Navbar />}
    </UserProvider>
  );
}

export default function App() {
  return (
    <AppShell>
      <main className="main-content">
        <Routes>
          {/* onboarding and main pages */}
          <Route path="/" element={<Landing />} />
          <Route path="/intro" element={<Intro />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/setup-profile" element={<SetupProfile />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          <Route path="/home" element={<Home />} />

          {/* profile */}
          <Route path="/profile/me" element={<ProfileMe />} />
          <Route path="/profile/me/edit" element={<ProfileEdit />} />
          <Route path="/profile/me/following" element={<ProfileFollowing />} />
          <Route path="/profile/:id" element={<ProfileOther />} />

          {/* notifications */}
          <Route path="/notifications" element={<Notifications />} />

          {/* add post */}
          <Route path="/add-post" element={<AddPostLayout />}>
            <Route index element={<AddPostIndex />} />
            <Route path="post" element={<AddPostPost />} />
            <Route path="match" element={<AddPostMatch />} />
            <Route path="activity" element={<AddPostActivity />} />
            <Route path="event" element={<AddPostEvent />} />
          </Route>

          {/* chat */}
          <Route path="/chat" element={<Chat />} />

          {/* scouting */}
          <Route path="/scouting" element={<ScoutingLayout />}>
            <Route index element={<ScoutingIndex />} />
            <Route path="search" element={<ScoutingSearch />} />
          </Route>

          {/* fallback for unknown routes */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </main>
    </AppShell>
  );
}
