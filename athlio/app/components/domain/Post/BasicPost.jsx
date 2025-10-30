import PostHeader from "./PostHeader";
import PostActions from "./PostActions";
import "./BasicPost.css";
import { useEffect, useRef, useState } from "react";

export default function BasicPost({
  id,
  author,
  content,
  imageUrl,
  createdAt,
  author_role,
}) {
  if (!id) return null;

  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    const el = textRef.current;
    if (el) {
      setIsOverflowing(el.scrollHeight > el.clientHeight);
    }
  }, [content]);

  return (
    <article className="post" data-id={id}>
      <PostHeader name={author} date={createdAt} role={author_role} />

      {content && (
        <div className="post-content-container">
          <p
            ref={textRef}
            className={`post-content ${isExpanded ? "expanded" : ""}`}
          >
            {content}
          </p>
          {isOverflowing && (
            <button
              className="see-more"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "See less" : "See more"}
            </button>
          )}
        </div>
      )}

      {imageUrl && (
        <div className="post-media">
          <img className="post-image" src={imageUrl} alt="" />
        </div>
      )}
      <PostActions postId={id} auraCount={12} commentCount={3} />
    </article>
  );
}
