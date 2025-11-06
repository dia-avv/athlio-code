import Button from "../../UI/Button";
import MatchIcon from "../../../assets/icons/stats.svg?react";
import PictureIcon from "../../../assets/icons/image.svg?react";
import EventIcon from "../../../assets/icons/event.svg?react";
import "./PostPillBar.css";
import { useNavigate } from "react-router";
import { useRef } from "react";

export default function PostPillBar({ onImageSelected }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  function handleMatchClick() {
    navigate("/add-post/match");
  }

  function handleEventClick() {
    navigate("/add-post/event");
  }

  function handlePictureClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelected?.(file); // hand the file to parent (Composer)
      e.target.value = ""; // allow picking the same file again later
    }
  }

  return (
    <div className="pill-bar">
      <Button
        size="small"
        type="gray"
        label="Match"
        Icon={MatchIcon}
        className="pill-button"
        onClick={handleMatchClick}
      />
      <Button
        size="small"
        type="gray"
        label="Picture"
        Icon={PictureIcon}
        className="pill-button"
        onClick={handlePictureClick}
      />
      <Button
        size="small"
        type="gray"
        label="Event"
        Icon={EventIcon}
        className="pill-button"
        onClick={handleEventClick}
      />
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
}
