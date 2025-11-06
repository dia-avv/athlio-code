export default function PostsTab({ profile }) {
  return (
    <div className="tab-section">
      <h3>{profile.full_name}’s Posts</h3>
      <p>Posts content goes here…</p>
    </div>
  );
}
