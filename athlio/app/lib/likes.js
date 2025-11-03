import { supabase } from "./supabase";

async function uid() {
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new Error("Not authenticated");
  return data.user.id;
}

export async function getLikeState(postId) {
  const me = await uid();

  // did I like it?
  const { data: mine } = await supabase
    .from("post_likes")
    .select("post_id")
    .eq("post_id", postId)
    .eq("user_id", me)
    .maybeSingle();

  // current cached count from posts (trigger keeps it fresh)
  const { data: row } = await supabase
    .from("posts")
    .select("aura_count")
    .eq("id", postId)
    .maybeSingle();

  return { liked: !!mine, likeCount: row?.aura_count ?? 0 };
}

export async function like(postId) {
  const me = await uid();
  const { error } = await supabase
    .from("post_likes")
    .insert([{ post_id: postId, user_id: me }]);
  // ignore duplicate like
  if (error && error.code !== "23505") throw error;
}

export async function unlike(postId) {
  const me = await uid();
  const { error } = await supabase
    .from("post_likes")
    .delete()
    .eq("post_id", postId)
    .eq("user_id", me);
  if (error) throw error;
}
