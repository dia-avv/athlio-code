import Button from "../../UI/Button";
import MatchIcon from "../../../assets/icons/stats.svg?react";
import PictureIcon from "../../../assets/icons/image.svg?react";
import EventIcon from "../../../assets/icons/event.svg?react";
import "./PostPillBar.css";

export default function PostPillBar() {
  return (
    <div className="pill-bar">
      <Button
        size="small"
        type="gray"
        label="Match"
        Icon={MatchIcon}
        className="pill-button"
      />
      <Button
        size="small"
        type="gray"
        label="Picture"
        Icon={PictureIcon}
        className="pill-button"
      />
      <Button
        size="small"
        type="gray"
        label="Event"
        Icon={EventIcon}
        className="pill-button"
      />
    </div>
  );
}
