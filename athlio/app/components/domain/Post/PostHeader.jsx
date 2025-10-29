import ProfilePicture from "../../UI/ProfilePicture";
import Player from "../../../assets/images/player.jpg";
import PlusIcon from "../../../assets/icons/plus.svg?react";
import CheckIcon from "../../../assets/icons/check.svg?react";
import Button from "../../UI/Button";
import "./PostHeader.css";
import { useState } from "react";

export default function PostHeader({ name, role, date }) {
  const [isFollowing, setIsFollowing] = useState(false);

  function handleFollow() {
    setIsFollowing((prev) => !prev);
  }
  return (
    <div className="post-header">
      <div className="header-left">
        <ProfilePicture size="medium" verified={true} imgUrl={Player} />
        <div className="header-text">
          <p className="name">{name}</p>
          <div className="subheader-text">
            <p className="role">{role}</p>
            <p className="date">{date}</p>
          </div>
        </div>
      </div>
      <Button
        size="small"
        type={isFollowing ? "following" : "primary"}
        label={isFollowing ? "" : "Follow"}
        Icon={isFollowing ? CheckIcon : PlusIcon}
        onClick={handleFollow}
      />
    </div>
  );
}
