import { Link, useLocation } from "react-router";
import { useUser } from "../context/UserContext";
import HomeIcon from "../assets/icons/home.svg";
import HomeActive from "../assets/icons/home-active.svg";
import ChallengesIcon from "../assets/icons/challenges.svg";
import ChallengesActive from "../assets/icons/challenges-active.svg";
import ComparisonIcon from "../assets/icons/comparison.svg";
import ComparisonActive from "../assets/icons/comparison-active.svg";
import SearchIcon from "../assets/icons/search.svg";
import SearchActive from "../assets/icons/search-active.svg";
import PlusIcon from "../assets/icons/plus.svg";
import "./Navbar.css";

export default function Navbar() {
  const { pathname } = useLocation();
  const { profile, loading } = useUser();

  const isActive = (path) => pathname === path;

  if (loading) {
    return (
      <nav>
        <Link to="/home" className={isActive("/home") ? "active" : ""}>
          <img
            src={isActive("/home") ? HomeActive : HomeIcon}
            alt="Home"
            width="24"
            height="24"
          />
        </Link>
        <span>Loading...</span>
        <Link to="/profile" className={isActive("/profile") ? "active" : ""}>
          <div className="profile-placeholder" />
        </Link>
      </nav>
    );
  }

  const role = profile?.role || "athlete";

  return (
    <nav>
      <Link to="/home" className={isActive("/home") ? "active" : ""}>
        <img
          src={isActive("/home") ? HomeActive : HomeIcon}
          alt="Home"
          width="24"
          height="24"
        />
      </Link>
      <Link to="/search" className={isActive("/search") ? "active" : ""}>
        <img
          src={isActive("/search") ? SearchActive : SearchIcon}
          alt="Home"
          width="24"
          height="24"
        />
      </Link>
      <Link to="/add-post" className={isActive("/add-post") ? "active" : ""}>
        <img src={PlusIcon} alt="Add Post" width="24" height="24" />
      </Link>
      {role === "scout" ? (
        <Link
          to="/comparison"
          className={isActive("/comparison") ? "active" : ""}
        >
          <img
            src={isActive("/comparison") ? ComparisonActive : ComparisonIcon}
            alt="Home"
            width="24"
            height="24"
          />
        </Link>
      ) : (
        <Link
          to="/challenges"
          className={isActive("/challenges") ? "active" : ""}
        >
          <img
            src={isActive("/challenges") ? ChallengesActive : ChallengesIcon}
            alt="Home"
            width="24"
            height="24"
          />
        </Link>
      )}
      <Link to="/profile" className={isActive("/profile") ? "active" : ""}>
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
          {isActive("/profile") && <div className="circle"></div>}
        </div>
      </Link>
    </nav>
  );
}
