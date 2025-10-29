import PostIcon from "../../UI/PostIcon";
import AuraIcon from "../../../assets/icons/aura.svg?react";
import CommentIcon from "../../../assets/icons/comment.svg?react";
import RepostIcon from "../../../assets/icons/repost.svg?react";
import "./PostActions.css";
import { useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function PostActions({
  postId,
  auraCount = 0,
  commentCount = 0,
}) {
  const [liked, setLiked] = useState(false);
  const [reposted, setReposted] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [likes, setLikes] = useState(auraCount);
  const [comments, setComments] = useState(commentCount);

  async function handleAura() {
    const newLiked = !liked;
    setLiked(newLiked);
    const newLikes = newLiked ? likes + 1 : likes - 1;
    setLikes(newLikes);

    await supabase
      .from("posts")
      .update({ aura_count: newLikes })
      .eq("id", postId);
  }

  async function handleComment() {
    setShowComments(!showComments);
  }

  async function handleRepost() {
    const newReposted = !reposted;
  }

  return (
    <div className="post-actions">
      <PostIcon
        Icon={AuraIcon}
        count={likes}
        onClick={handleAura}
        className={`postIcon ${liked ? "active" : ""}`}
      />
      <PostIcon Icon={CommentIcon} count={comments} onClick={handleComment} />
      <PostIcon Icon={RepostIcon} onClick={handleRepost} />
    </div>
  );
}
