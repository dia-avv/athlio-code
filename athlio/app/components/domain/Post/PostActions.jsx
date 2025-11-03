import PostIcon from "../../UI/PostIcon";
import AuraIcon from "../../../assets/icons/aura.svg?react";
import CommentIcon from "../../../assets/icons/comment.svg?react";
import RepostIcon from "../../../assets/icons/repost.svg?react";
import "./PostActions.css";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { getLikeState, like, unlike } from "../../../lib/likes";

export default function PostActions({
  postId,
  auraCount = 0,
  commentCount = 0,
}) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(auraCount);
  const [reposted, setReposted] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(commentCount);

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const { liked, likeCount } = await getLikeState(postId);
        if (live) {
          setLiked(liked);
          setLikes(likeCount);
        }
      } catch (e) {
        console.error("init like state", e);
      }
    })();

    // optional realtime count updates
    const ch = supabase
      .channel(`likes:${postId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "post_likes",
          filter: `post_id=eq.${postId}`,
        },
        async () => {
          const { data } = await supabase
            .from("posts")
            .select("aura_count")
            .eq("id", postId)
            .maybeSingle();
          setLikes(data?.aura_count ?? 0);
        },
      )
      .subscribe();

    return () => {
      live = false;
      supabase.removeChannel(ch);
    };
  }, [postId]);

  async function handleAura() {
    const next = !liked;
    // optimistic
    setLiked(next);
    setLikes((n) => n + (next ? 1 : -1));
    try {
      if (next) await like(postId);
      else await unlike(postId);
    } catch (e) {
      // revert if server balks
      console.error("toggle like", e);
      setLiked(!next);
      setLikes((n) => n + (next ? -1 : 1));
    }
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
