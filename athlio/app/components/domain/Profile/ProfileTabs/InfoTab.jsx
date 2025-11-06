import CardInfoSingle from "../../../UI/InfoCards";
import "./InfoTab.css";

export default function InfoTab({ profile }) {
  return (
    <main>
      <div className="profile-info-tab">
        <CardInfoSingle />
      </div>
    </main>
  );
}
