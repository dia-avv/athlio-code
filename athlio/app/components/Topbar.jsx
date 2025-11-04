import { useLocation, useNavigate } from "react-router";
import { useUser } from "../context/UserContext";
import MessagesIcon from "../assets/icons/messages.svg";
import NotificationsIcon from "../assets/icons/notifications.svg";
import BackIcon from "../assets/icons/back.svg";
import CloseIcon from "../assets/icons/close.svg";
import MainLogo from "../assets/logos/main-logo.svg?react";
import "./Topbar.css";

//changes how the topbar looks based on what page the user is on
//doing it this way instead of per-page to avoid code duplication and also its easier to maintain
const TOPBAR_CONFIG = {
  "/home": {
    title: null,
    left: () => <MainLogo className="main-logo" />,
    right: (nav, _profile, counts) => (
      <div className="topbar-icons">
        <div className="icon-with-badge" onClick={() => nav("/notifications")}>
          <img src={NotificationsIcon} alt="Notifications" />
          {counts.notifications > 0 && (
            <span className="badge">+{counts.notifications}</span>
          )}
        </div>
        <div className="icon-with-badge" onClick={() => nav("/chat")}>
          <img src={MessagesIcon} alt="Messages" />
          {counts.messages > 0 && (
            <span className="badge">{counts.messages}</span>
          )}
        </div>
      </div>
    ),
  },
  "/chat": {
    title: null,
    left: (nav) => <img src={BackIcon} alt="Back" onClick={() => nav(-1)} />,
    center: () => (
      <input placeholder="Search messages" className="topbar-search" /> //it will be a component later
    ),
  },
  "/notifications": {
    title: null,
    left: (nav) => (
      <div className="topbar-left-with-back">
        <img src={BackIcon} alt="Back" onClick={() => nav(-1)} />
        <MainLogo className="main-logo" />
      </div>
    ),
  },
  "/new-post": {
    title: null,
    left: (nav, profile) => (
      <>
        <button onClick={() => nav(-1)}>
          <img src={CloseIcon} alt="Close" />
        </button>
        {profile?.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt="Profile"
            className="topbar-avatar"
          />
        ) : (
          <div className="topbar-avatar placeholder" />
        )}
      </>
    ),
    right: () => (
      <button className="topbar-post-btn">Post it</button> //it will be a component later
    ),
  },
  "/scouting": {
    title: null,
    left: () => <MainLogo className="main-logo" />,
    right: (nav, _profile, counts) => (
      <div className="topbar-icons">
        <div className="icon-with-badge" onClick={() => nav("/notifications")}>
          <img src={NotificationsIcon} alt="Notifications" />
          {counts.notifications > 0 && (
            <span className="badge">+{counts.notifications}</span>
          )}
        </div>
        <div className="icon-with-badge" onClick={() => nav("/chat")}>
          <img src={MessagesIcon} alt="Messages" />
          {counts.messages > 0 && (
            <span className="badge">{counts.messages}</span>
          )}
        </div>
      </div>
    ),
  },
};

export default function Topbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { profile, counts } = useUser();

  const config = TOPBAR_CONFIG[pathname];
  if (!config) return null;

  return (
    <header className="topbar">
      <div>{config.left?.(navigate, profile, counts)}</div>
      {config.center?.(navigate, profile, counts) || (
        <h1 className="topbar-title">{config.title}</h1>
      )}
      <div>{config.right?.(navigate, profile, counts)}</div>
    </header>
  );
}
