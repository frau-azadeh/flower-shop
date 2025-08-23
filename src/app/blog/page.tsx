import BlogIndexClient from "./BlogIndexClient";
import { createSupabaseClient } from "@/lib/supabase";
import { PostRow } from "@/types/blog";

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const page = Number(sp?.page) || 1;

  const supabase = await createSupabaseClient();
  const { data } = await supabase
    .from("posts")
    .select("title, slug, content, publishedAt, coverUrl")
    .eq("status", "published")
    .order("publishedAt", { ascending: false });

  const posts: PostRow[] = (data ?? []) as PostRow[];

  return <BlogIndexClient posts={posts} page={page} />;
}
