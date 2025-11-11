import { Link, useLocation, useNavigate } from "react-router";
import { useState } from "react";
import { useUser } from "../context/UserContext";
import HomeIcon from "../assets/icons/home.svg?react";
import HomeActive from "../assets/icons/home-active.svg?react";
import ChallengesIcon from "../assets/icons/challenges.svg?react";
import ChallengesActive from "../assets/icons/challenges-active.svg?react";
import ComparisonIcon from "../assets/icons/comparison.svg?react";
import ComparisonActive from "../assets/icons/comparison-active.svg?react";
import SearchIcon from "../assets/icons/search.svg?react";
import SearchActive from "../assets/icons/search-active.svg?react";
import PlusIcon from "../assets/icons/plus.svg?react";
import PostTypePicker from "./domain/MakeAPost/PostTypePicker";
import AddPostModal from "./domain/MakeAPost/AddPostModal";
import "./Navbar.css";

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [showPicker, setShowPicker] = useState(false);

  function handleChoose(type) {
    setShowPicker(false);
    navigate(`/add-post?type=${type}`);
  }

  const { profile, loading } = useUser();

  const isActive = (path) => pathname === path;

  if (loading) {
    return (
      <nav className="navbar">
        <Link to="/home" className={isActive("/home") ? "active" : ""}>
          {isActive("/home") ? (
            <HomeActive width="24" height="24" aria-hidden="true" />
          ) : (
            <HomeIcon width="24" height="24" aria-hidden="true" />
          )}
        </Link>
        <span>Loading...</span>
        <Link to="/profile/me" className={isActive("/profile/me") ? "active" : ""}>
          <div className="profile-placeholder" />
        </Link>
      </nav>
    );
  }

  const role = profile?.role || "athlete";

  return (
    <>
      <nav className="navbar">
        <Link to="/home" className={isActive("/home") ? "active" : ""}>
          {isActive("/home") ? (
            <HomeActive width="24" height="24" aria-hidden="true" />
          ) : (
            <HomeIcon width="24" height="24" aria-hidden="true" />
          )}
        </Link>
        <Link
          to="/scouting/search"
          className={isActive("/scouting/search") ? "active" : ""}
        >
          {isActive("/scouting/search") ? (
            <SearchActive width="24" height="24" aria-hidden="true" />
          ) : (
            <SearchIcon width="24" height="24" aria-hidden="true" />
          )}
        </Link>
        <button
          type="button"
          className={`navbar-plus ${isActive("/add-post") ? "active" : ""}`}
          onClick={() => setShowPicker((prev) => !prev)}
          aria-label="Create new post"
          style={{
            background: "transparent",
            border: 0,
            padding: 0,
            cursor: "pointer",
          }}
        >
          <PlusIcon width="24" height="24" aria-hidden="true" />
        </button>
        {role === "scout" ? (
          <Link
            to="/scouting"
            className={isActive("/scouting") ? "active" : ""}
          >
            {isActive("/scouting") ? (
              <ComparisonActive width="24" height="24" aria-hidden="true" />
            ) : (
              <ComparisonIcon width="24" height="24" aria-hidden="true" />
            )}
          </Link>
        ) : (
          <Link
            to="/notifications"
            className={isActive("/notifications") ? "active" : ""}
          >
            {isActive("/notifications") ? (
              <ChallengesActive width="24" height="24" aria-hidden="true" />
            ) : (
              <ChallengesIcon width="24" height="24" aria-hidden="true" />
            )}
          </Link>
        )}
        <Link
          to="/profile/me"
          className={isActive("/profile/me") ? "active" : ""}
        >
          <div>
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="Profile"
                className="profile-avatar"
              />
            ) : (
              <div className="profile-placeholder" />
            )}
            {isActive("/profile/me") && <div className="circle"></div>}
          </div>
        </Link>
      </nav>
      <AddPostModal open={showPicker} onClose={() => setShowPicker(false)}>
        <PostTypePicker onChoose={handleChoose} />
      </AddPostModal>
    </>
  );
}
