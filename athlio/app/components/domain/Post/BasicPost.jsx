import PostHeader from "./PostHeader";
import PostActions from "./PostActions";
import "./BasicPost.css";

export default function BasicPost({
  id,
  author,
  content,
  imageUrl,
  createdAt,
  author_role,
}) {
  if (!id) return null;

  return (
    <article className="post" data-id={id}>
      <PostHeader name={author} date={createdAt} role={author_role} />

      {content && <p className="post-content">{content}</p>}

      {imageUrl && (
        <div className="post-media">
          <img className="post-image" src={imageUrl} alt="" />
        </div>
      )}
      <PostActions postId={id} auraCount={12} commentCount={3} />
    </article>
  );
}
