import { useLocation, useNavigate } from "react-router";
import { useUser } from "../context/UserContext";
import MessagesIcon from "../assets/icons/messages.svg";
import BurgerMenuIcon from "../assets/icons/burger-menu.svg";
import ShareIcon from "../assets/icons/share.svg";
import NotificationsIcon from "../assets/icons/notifications.svg";
import BackIcon from "../assets/icons/back.svg";
import CloseIcon from "../assets/icons/close.svg";
import MainLogo from "../assets/logos/main-logo.svg?react";
import "./Topbar.css";
import Button from "./UI/Button";

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
  "/add-post": {
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
  "/profile/me": {
    title: null,
    left: (nav, profile) => (
      <div className="topbar-left-with-back">
        <img
          src={BackIcon}
          alt="Back"
          onClick={() => nav(-1)}
          className="topbar-back"
        />
        <MainLogo className="main-logo" />
      </div>
    ),
    right: (nav, profile) => (
      <div className="topbar-icons">
        <img
          src={BurgerMenuIcon}
          alt="Menu"
          className="topbar-menu-icon"
          onClick={() => {
            // TODO: open your menu later
            console.log("Menu clicked");
          }}
        />
      </div>
    ),
  },
  "/profile/other": {
    title: null,
    left: (nav) => (
      <div className="topbar-left-with-back">
        <img
          src={BackIcon}
          alt="Back"
          onClick={() => nav(-1)}
          className="topbar-back"
        />
        <MainLogo className="main-logo" />
      </div>
    ),
    right: () => (
      <Button
        size="small"
        type="outline"
        onClick={() => {
          console.log("Share clicked");
        }}
        Icon={() => <img src={ShareIcon} alt="Share" />}
      />
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

  let config = TOPBAR_CONFIG[pathname];
  // Use the add-post layout for all nested add-post routes
  if (!config && pathname.startsWith("/add-post")) {
    config = TOPBAR_CONFIG["/add-post"];
  }

  if (!config && pathname.startsWith("/profile/")) {
    if (!pathname.startsWith("/profile/me")) {
      config = TOPBAR_CONFIG["/profile/other"];
    }
  }

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
