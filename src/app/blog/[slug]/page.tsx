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
    <article className="prose mx-auto p-4 bg-background" dir="rtl">
      <div className="max-w-7xl bg-white rounded-md mx-auto p-10 shadow flex flex-col ">
        <h1 className="font-bold text-lg text-primary leading-10">
          {data.title}
        </h1>
        <span className="text-xs opacity-70 leading-5 block">
          {data.publishedAt
            ? new Date(data.publishedAt).toLocaleDateString("fa-IR")
            : ""}
        </span>
        <p className="whitespace-pre-wrap leading-10  text-slate-700">
          {data.content}
        </p>
      </div>
    </article>
  );
}
