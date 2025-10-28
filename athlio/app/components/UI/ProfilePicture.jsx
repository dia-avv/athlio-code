import "./ProfilePicture.css";
import VerifiedBadge from "./VerifiedBadge";

export default function ProfilePicture({
  imgUrl = "",
  size = "",
  verified = false,
}) {
  return (
    <div className="profile-picture-container">
      <img
        src={imgUrl}
        alt="Profile Picture"
        className={`profile-picture ${size}`}
      />
      <div className="verification-badge-profile">
        {verified && (
          <VerifiedBadge
            containerSize={`container-${size}`}
            iconSize={`icon-${size}`}
          />
        )}
      </div>
    </div>
  );
}
