export default function InfoTab({ profile }) {
  return (
    <div className="tab-section">
      <h3>About {profile.full_name}</h3>
      <p>{profile.bio || "No bio yet."}</p>
    </div>
  );
}
