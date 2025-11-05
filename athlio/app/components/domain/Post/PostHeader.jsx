import { useEffect, useState, useTransition } from "react";
import ProfilePicture from "../../UI/ProfilePicture";
import Player from "../../../assets/images/player.jpg";
import PlusIcon from "../../../assets/icons/plus.svg?react";
import CheckIcon from "../../../assets/icons/check.svg?react";
import Button from "../../UI/Button";
import "./PostHeader.css";
import {
  isFollowing as fetchIsFollowing,
  follow,
  unfollow,
} from "../../../lib/follows";
import { Link } from "react-router";

export default function PostHeader({ name, position, club, date, authorId }) {
  const [isFollowing, setIsFollowing] = useState(null); // null = loading
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const v = await fetchIsFollowing(authorId);
        if (alive) setIsFollowing(v);
      } catch {
        if (alive) setIsFollowing(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [authorId]);

  function onToggle() {
    if (isFollowing === null) return;
    const next = !isFollowing;
    setIsFollowing(next); // optimistic

    startTransition(async () => {
      try {
        if (next) await follow(authorId);
        else await unfollow(authorId);
      } catch (e) {
        console.error(e);
        setIsFollowing(!next); // revert on fail
      }
    });
  }

  const loading = isFollowing === null || isPending;
  const profileHref = `/u/&{authorId}`;

  return (
    <div className="post-header">
      <div className="header-left">
        <Link to={profileHref} className="author-link">
          <ProfilePicture size="medium" verified={true} imgUrl={Player} />
        </Link>
        <div className="header-text">
          <Link to={profileHref} className="author-link">
            <p className="name">{name}</p>
          </Link>
          <div className="subheader-text">
            <p className="role">
              {position && club
                ? `${position} at @${club}`
                : position || club || ""}
            </p>
            <p className="date">{date}</p>
          </div>
        </div>
      </div>

      <Button
        size="small"
        type={isFollowing ? "following" : "primary"}
        label={loading ? "..." : isFollowing ? "" : "Follow"}
        Icon={loading ? undefined : isFollowing ? CheckIcon : PlusIcon}
        onClick={onToggle}
        disabled={loading}
      />
    </div>
  );
}
