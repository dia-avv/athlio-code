import ProfilePicture from "../../UI/ProfilePicture";
import Player from "../../../assets/images/player.jpg";
import PlusIcon from "../../../assets/icons/plus.svg?react";
import Button from "../../UI/Button";
import "./PostHeader.css";

export default function PostHeader({ name, role, date }) {
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
      <Button size="small" type="primary" label="Follow" Icon={PlusIcon} />
    </div>
  );
}
