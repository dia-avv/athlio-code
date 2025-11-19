import { useLoaderData } from "react-router";
import { supabase } from "../lib/supabase";
import { PostSwitcher } from "../components/domain/Feed";

export async function clientLoader({ params }) {
  const { id } = params;

  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      profiles:author_id (
        id,
        full_name,
        username,
        avatar_url,
        position,
        club:club_id (
          id,
          name,
          logo_url
        )
      )
    `,
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    console.error(error);
    return null;
  }

  return data;
}

export default function PostPage() {
  const post = useLoaderData();

  if (!post) {
    return <div style={{ padding: 20 }}>Post not found.</div>;
  }

  return <PostSwitcher post={post} />;
}
