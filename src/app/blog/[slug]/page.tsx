// app/blog/[slug]/page.tsx
import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabaseServer";

type RouteParams = { slug: string };

export default async function BlogPost({
  params,
}: {
  params: Promise<RouteParams>; // نکته: Promise<>
}) {
  const { slug } = await params; // نکته: await

  const sb = supabaseServer();
  const { data, error } = await sb
    .from("posts")
    .select("title, content, publishedAt, status")
    .eq("slug", slug)
    .eq("status", "published") // فقط پست‌های منتشرشده
    .maybeSingle();

  if (error) console.error(error);
  if (!data) return notFound();

  return (
    <article className="prose mx-auto p-4" dir="rtl">
      <h1>{data.title}</h1>
      <p className="text-xs opacity-70">
        {data.publishedAt
          ? new Date(data.publishedAt).toLocaleDateString("fa-IR")
          : ""}
      </p>
      <div className="whitespace-pre-wrap leading-7">{data.content}</div>
    </article>
  );
}
