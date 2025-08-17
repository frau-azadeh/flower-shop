// app/blog/page.tsx
import BlogIndexClient from "./BlogIndexClient";
import { createSupabaseClient } from "@/lib/supabase";

type Row = {
  title: string;
  slug: string;
  content: string;
  publishedAt: string | null;
  coverUrl: string | null;
};

// در Next 15: searchParams یک Promise است
export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams; // ← حتماً await
  const page = Number(sp?.page) || 1;

  const supabase = await createSupabaseClient();
  const { data } = await supabase
    .from("posts")
    .select("title, slug, content, publishedAt, coverUrl")
    .eq("status", "published")
    .order("publishedAt", { ascending: false });

  const posts: Row[] = (data ?? []) as Row[];

  return <BlogIndexClient posts={posts} page={page} />;
}
