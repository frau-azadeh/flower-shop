import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabaseServer";
import { sanitizeContent } from "@/lib/sanitize";
import type { FullPost, MiniPost } from "@/types/blog";

import CoverCard from "./components/CoverCard";
import RecentPosts from "./components/RecentPosts";
import ArticleHeader from "./components/ArticleHeader";
import ArticleBody from "./components/ArticleBody";
import ShareBox from "./components/ShareBox";

type RouteParams = { slug: string };

export default async function BlogPost({
  params,
}: {
  // Next 15: params به‌صورت Promise می‌آید
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;

  const sb = supabaseServer();

  // پست جاری
  const { data, error } = await sb
    .from("posts")
    .select("title, content, publishedAt, status, coverUrl")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle<FullPost>();

  if (error) console.error(error);
  if (!data) return notFound();

  // ۳ پست آخر (غیر از پست فعلی)
  const { data: recent } = await sb
    .from("posts")
    .select("slug, title, coverUrl, publishedAt")
    .eq("status", "published")
    .neq("slug", slug)
    .order("publishedAt", { ascending: false })
    .limit(3)
    .returns<MiniPost[]>();

  const safeHtml = sanitizeContent(data.content ?? "");
  const faDate = data.publishedAt
    ? new Date(data.publishedAt).toLocaleDateString("fa-IR")
    : "";

  return (
    <article dir="rtl" className="bg-background py-10">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 md:grid-cols-5">
        {/* تصویر + اشتراک‌گذاری + ۳ پست آخر (فقط دسکتاپ) */}
        <aside className="order-1 md:order-2 md:col-span-2">
          <div className="md:sticky md:top-24">
            <CoverCard title={data.title} coverUrl={data.coverUrl} />
            <ShareBox slug={slug} title={data.title} />
            <RecentPosts posts={recent ?? []} className="mt-4 hidden md:block" />
          </div>
        </aside>

        {/* متن */}
        <section className="order-2 md:order-1 md:col-span-3">
          <div className="rounded-2xl bg-white shadow ring-1 ring-black/5">
            <ArticleHeader title={data.title} faDate={faDate} />
            <ArticleBody html={safeHtml} />
          </div>

          {/* ۳ پست آخر – موبایل (ته صفحه) */}
          <RecentPosts posts={recent ?? []} className="mt-8 md:hidden" />
        </section>
      </div>
    </article>
  );
}
