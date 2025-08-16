import { createSupabaseClient } from "@/lib/supabase";

type Row = {
  title: string;
  slug: string;
  publishedAt: string | null;
};

export default async function BlogIndex() {
  const supabase = await createSupabaseClient();
  const { data } = await supabase
    .from("posts")
    .select("title, slug, publishedAt")
    .eq("status", "published")
    .order("publishedAt", { ascending: false });

  const posts: Row[] = (data ?? []) as Row[];

  return (
    <main dir="rtl" className="mx-auto max-w-3xl p-4 bg-background">
      <h1 className="text-2xl folnt-bold mb-4">بلاگ</h1>
      <ul className="space-y-3">
        {posts.map((p) => (
          <li key={p.slug} className="rounded-md border p-3">
            <a href={`/blog/${p.slug}`} className="font-bold text-primary">
              {p.title}
            </a>
            <div className="text-xs text-slate-300">
              {p.publishedAt
                ? new Date(p.publishedAt).toLocaleDateString()
                : ""}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
