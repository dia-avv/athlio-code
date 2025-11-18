import "./CommentCard.css";

export default function CommentCard({ comment }) {
  const prof = comment.profiles || {};

  return (
    <div key={comment.id} className="comment-row">
      <div className="comment-avatar">
        {prof.avatar_url ? (
          <img src={prof.avatar_url} alt={prof.username || "User"} />
        ) : (
          <div className="comment-avatar-fallback">
            {(prof.full_name || prof.username || "?")[0]}
          </div>
        )}
      </div>
      <div className="comment-main">
        <div className="comment-meta">
          <span className="comment-name">
            {prof.full_name || prof.username || "Unknown"}
          </span>
          <span className="comment-time">
            {new Date(comment.created_at).toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <p className="comment-text">{comment.content}</p>
      </div>
    </div>
  );
}
