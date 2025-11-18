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
  const [likes, setLikes] = useState(Number(auraCount) || 0);
  const [reposted, setReposted] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(Number(commentCount) || 0);

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
          const { count } = await supabase
            .from("post_likes")
            .select("*", { count: "exact", head: true })
            .eq("post_id", postId);
          setLikes(typeof count === "number" ? count : 0);
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

    // optimistic toggle
    setLiked(next);
    setLikes((prev) => {
      const base = Number(prev) || 0;
      const delta = next ? 1 : -1;
      return Math.max(0, base + delta);
    });

    try {
      if (next) {
        await like(postId);
      } else {
        await unlike(postId);
      }
    } catch (e) {
      console.error("toggle like", e);
      // revert optimistic update on error
      setLiked(!next);
      setLikes((prev) => {
        const base = Number(prev) || 0;
        const delta = next ? -1 : 1;
        return Math.max(0, base + delta);
      });
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
