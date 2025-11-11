import { useLocation, useNavigate } from "react-router";
import { useUser } from "../context/UserContext";
import MessagesIcon from "../assets/icons/messages.svg?react";
import BurgerMenuIcon from "../assets/icons/burger-menu.svg?react";
import ShareIcon from "../assets/icons/share.svg?react";
import NotificationsIcon from "../assets/icons/notifications.svg?react";
import BackIcon from "../assets/icons/back.svg?react";
import CloseIcon from "../assets/icons/close.svg?react";
import MainLogo from "../assets/logos/main-logo.svg?react";
import "./Topbar.css";
import Button from "./UI/Button";
import IconButton from "./UI/IconButton";
import ProfilePicture from "./UI/ProfilePicture";

//changes how the topbar looks based on what page the user is on
//doing it this way instead of per-page to avoid code duplication and also its easier to maintain
const TOPBAR_CONFIG = {
  "/home": {
    title: null,
    left: () => <MainLogo className="main-logo" />,
    right: (nav, _profile, counts) => (
      <div className="topbar-icons">
        <div className="icon-with-badge" onClick={() => nav("/notifications")}>
          <NotificationsIcon aria-hidden="true" />
          {counts.notifications > 0 && (
            <span className="badge">+{counts.notifications}</span>
          )}
        </div>
        <div className="icon-with-badge" onClick={() => nav("/chat")}>
          <MessagesIcon aria-hidden="true" />
          {counts.messages > 0 && (
            <span className="badge">{counts.messages}</span>
          )}
        </div>
      </div>
    ),
  },
  "/chat": {
    title: null,
    left: (nav) => (
      <BackIcon
        aria-label="Go back"
        className="topbar-back"
        role="img"
        onClick={() => nav(-1)}
      />
    ),
    center: () => (
      <input placeholder="Search messages" className="topbar-search" /> //it will be a component later
    ),
  },
  "/notifications": {
    title: null,
    left: (nav) => (
      <div className="topbar-left-with-back">
        <BackIcon
          aria-label="Go back"
          className="topbar-back"
          role="img"
          onClick={() => nav(-1)}
        />
        <MainLogo className="main-logo" aria-label="Athlio" role="img" />
      </div>
    ),
  },
  "/add-post": {
    title: null,
    left: (nav, profile) => (
      <div className="button-avatar">
        <IconButton
          onClick={() => nav(-1)}
          size="large"
          type="subtle"
          icon={CloseIcon}
        />
        <ProfilePicture imgUrl={profile.avatar_url} size="medium" />
      </div>
    ),
    right: () => (
      <Button
        size="medium"
        type="primary"
        label="Post it"
        onClick={() => document.dispatchEvent(new Event("composer:submit"))}
      />
    ),
  },
  "/profile/me": {
    title: null,
    left: (nav, profile) => (
      <div className="topbar-left-with-back">
        <BackIcon
          aria-label="Go back"
          onClick={() => nav(-1)}
          className="topbar-back"
          role="img"
        />
        <MainLogo className="main-logo" />
      </div>
    ),
    right: (nav, profile) => (
      <div className="topbar-icons">
        <BurgerMenuIcon
          aria-label="Menu"
          className="topbar-menu-icon"
          role="img"
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
        <BackIcon
          aria-label="Go back"
          onClick={() => nav(-1)}
          className="topbar-back"
          role="img"
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
        Icon={ShareIcon}
      />
    ),
  },
  "/profile/me/edit": {
    title: "Edit profile",
    left: (nav) => (
      <IconButton
        size="large"
        type="subtle"
        icon={CloseIcon}
        onClick={() => nav(-1)}
      />
    ),
    center: () => <h1 className="topbar-title">Edit profile</h1>,
  },
  "/scouting": {
    title: null,
    left: () => <MainLogo className="main-logo" aria-label="Athlio" role="img" />,
    right: (nav, _profile, counts) => (
      <div className="topbar-icons">
        <div className="icon-with-badge" onClick={() => nav("/notifications")}>
          <NotificationsIcon aria-hidden="true" />
          {counts.notifications > 0 && (
            <span className="badge">+{counts.notifications}</span>
          )}
        </div>
        <div className="icon-with-badge" onClick={() => nav("/chat")}>
          <MessagesIcon aria-hidden="true" />
          {counts.messages > 0 && (
            <span className="badge">{counts.messages}</span>
          )}
        </div>
      </div>
    ),
  },
  "/scouting/search": {
    title: null,
    left: (nav) => (
      <div className="topbar-left-with-back">
        <BackIcon
          aria-label="Go back"
          onClick={() => nav(-1)}
          className="topbar-back"
          role="img"
        />
        <MainLogo className="main-logo" aria-label="Athlio" role="img" />
      </div>
    ),
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
