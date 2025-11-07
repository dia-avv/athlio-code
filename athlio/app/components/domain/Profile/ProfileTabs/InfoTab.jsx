import CardInfoSingle from "../../../UI/InfoCards";
import EditIcon from "../../../../assets/icons/edit.svg?react";
import "./InfoTab.css";
import Button from "../../../UI/Button";

export default function InfoTab({ profile, isMe = false }) {
  return (
    <main>
      <div className="profile-info-tab">
        {/* === Header with edit button === */}
        <div className="info-tab-header">
          {isMe && (
            <Button
              size="medium"
              type="outline"
              Icon={EditIcon}
              className="edit-info-btn"
              onClick={() => (window.location.href = "/edit-profile")}
            />
          )}
        </div>

        {/* === Info cards === */}
        <CardInfoSingle profile={profile} />
      </div>
    </main>
  );
}
