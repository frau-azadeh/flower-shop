// src/app/components/home/BlogPreview.tsx
import { headers } from "next/headers";
import Link from "next/link";
import BlogCarousel from "./BlogCarousel";
import { ChevronLeft } from "lucide-react";

export type BlogItem = {
  id: string;
  title: string;
  slug: string;
  coverUrl?: string | null;
  excerpt?: string | null;
  content?: string | null;
  created_at?: string | null;
};

function isBlogItem(x: unknown): x is BlogItem {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.slug === "string" &&
    typeof o.title === "string"
  );
}

function stripHtml(html?: string | null) {
  if (!html) return "";
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function makeExcerpt(item: BlogItem) {
  if (item.excerpt && item.excerpt.trim()) return item.excerpt.trim();
  const txt = stripHtml(item.content);
  const short = txt.slice(0, 140);
  return short + (txt.length > 140 ? "…" : "");
}

async function getBaseUrl(): Promise<string> {
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (!host) return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return `${proto}://${host}`;
}

async function loadPosts(limit = 8): Promise<BlogItem[]> {
  const base = await getBaseUrl();
  const urls = [
    `${base}/api/posts?limit=${limit}`,
    `${base}/api/blog/latest?limit=${limit}`,
  ];
  for (const u of urls) {
    try {
      const r = await fetch(u, { cache: "no-store" });
      if (!r.ok) continue;
      const d: unknown = await r.json();
      const candidates = [
        d,
        (d as { rows?: unknown }).rows,
        (d as { posts?: unknown }).posts,
        (d as { items?: unknown }).items,
      ];
      for (const c of candidates) {
        if (Array.isArray(c) && c.every(isBlogItem)) {
          // تکمیل excerpt برای زیبایی کارت
          return (c as BlogItem[]).map((p) => ({
            ...p,
            excerpt: makeExcerpt(p),
          }));
        }
      }
    } catch {}
  }
  return [];
}

export default async function BlogPreview() {
  const posts = await loadPosts(8); // ۸ تا تا اسلاید معنی‌دار باشد

  return (
    <section dir="rtl" className="bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-extrabold text-primary">
            از وبلاگ
          </h2>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 rounded-xl border border-border bg-white px-3 py-2 text-sm font-semibold text-primary shadow-sm hover:bg-slate-50"
          >
            مشاهده همه مطالب
 <ChevronLeft  className="size-4" />
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-border bg-white"
              >
                <div className="aspect-[16/10] w-full animate-pulse bg-slate-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
                  <div className="h-3 w-full animate-pulse rounded bg-slate-200" />
                  <div className="h-3 w-4/5 animate-pulse rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <BlogCarousel items={posts} />
        )}
      </div>
    </section>
  );
}
