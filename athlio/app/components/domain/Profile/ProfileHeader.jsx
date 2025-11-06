import Button from "../../UI/Button";
import ProfilePicture from "../../UI/ProfilePicture";
import Tag from "../../UI/Tag";
import VerifiedBadge from "../../UI/VerifiedBadge";
import Player from "../../../assets/images/player.jpg";
import PlusIcon from "../../../assets/icons/plus.svg?react";
import CheckIcon from "../../../assets/icons/check.svg?react";
import LocationIcon from "../../../assets/icons/location.svg?react";

import "./ProfileHeader.css";

export default function ProfileHeader({
  profile,
  isMe = false,
  isFollowing,
  toggleFollow,
  busy,
}) {
  if (!profile) return null;

  const hasTags = profile.role || profile.position;
  const locationText =
    profile.city && profile.country
      ? `${profile.city}, ${profile.country}`
      : profile.city || profile.country || null;

  return (
    <section className="profile-header">
      {/* === Top row: avatar, name, and tags === */}
      <div className="profile-header-row profile-header-top">
        <ProfilePicture size="large" verified={true} imgUrl={Player} />
        <div className="profile-top-text">
          <div className="profile-name-row">
            <h2 className="profile-name">{profile.full_name}</h2>
            {profile.verified && (
              <VerifiedBadge
                containerSize="container-small"
                iconSize="icon-small"
              />
            )}
          </div>
          <div className="profile-tags">
            {profile.role && <Tag label={profile.role} />}
            {profile.position && <Tag label={profile.position} />}
          </div>
        </div>
      </div>

      {/* === Middle section: bio and stats === */}
      <div className="profile-header-row profile-info">
        {profile.bio && <p className="profile-bio">{profile.bio}</p>}
        <div className="profile-meta">
          <span className="profile-followers">
            <strong>{profile.follower_count ?? 0}</strong> followers
          </span>
          {locationText && (
            <div className="profile-location">
              <LocationIcon />
              <span>{locationText}</span>
            </div>
          )}
        </div>
      </div>

      {/* ===  Bottom section: buttons === */}
      {!isMe && (
        <div className="profile-header-row profile-buttons">
          <Button
            size="medium"
            type={isFollowing ? "outline" : "primary"}
            label={isFollowing ? "Following" : "Follow"}
            onClick={toggleFollow}
            disabled={busy}
            Icon={isFollowing ? CheckIcon : PlusIcon}
          />
          <Button
            size="medium"
            type="outline"
            label="Message"
            onClick={() => console.log("Message clicked")}
          />
        </div>
      )}
    </section>
  );
}
