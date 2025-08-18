// app/blog/[slug]/page.tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { supabaseServer } from "@/lib/supabaseServer";
import { sanitizeContent } from "@/lib/sanitize";
import ShareBox from "./ShareBox"; // کلاینت‌کامپوننت

type RouteParams = { slug: string };

type MiniPost = {
  slug: string;
  title: string;
  coverUrl: string | null;
  publishedAt: string | null;
};

/* ========= کامپوننت سروری برای نمایش ۳ پست آخر ========= */
function RecentPosts({
  posts,
  className = "",
  title = "آخرین مطالب",
}: {
  posts: MiniPost[];
  className?: string;
  title?: string;
}) {
  if (!posts?.length) return null;

  return (
    <div className={className}>
      <div className="mb-3 text-sm font-semibold text-gray-700">{title}</div>

      <ul className="space-y-3">
        {posts.map((p) => (
          <li
            key={p.slug}
            className="overflow-hidden rounded-xl border bg-white shadow-sm hover:shadow transition"
          >
            <Link href={`/blog/${p.slug}`} className="flex gap-3">
              <div className="relative h-20 w-28 shrink-0 bg-gray-100">
                {p.coverUrl ? (
                  <Image
                    src={p.coverUrl}
                    alt={p.title}
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-400">
                    بدون کاور
                  </div>
                )}
              </div>

              <div className="flex min-w-0 flex-1 items-center pr-2">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-gray-900">
                    {p.title}
                  </div>
                  {p.publishedAt && (
                    <div className="mt-0.5 text-xs text-gray-500">
                      {new Date(p.publishedAt).toLocaleDateString("fa-IR")}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ========================= صفحه پست ========================= */
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
    .maybeSingle();

  if (error) console.error(error);
  if (!data) return notFound();

  // ۳ پست آخر (غیر از پست فعلی)
  const { data: recent } = await sb
    .from("posts")
    .select("slug, title, coverUrl, publishedAt")
    .eq("status", "published")
    .neq("slug", slug)
    .order("publishedAt", { ascending: false })
    .limit(3);

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
            <div className="overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/5 bg-white">
              <div className="relative aspect-[16/9] md:aspect-[20/15] bg-gradient-to-b from-gray-50 to-gray-100">
                {data.coverUrl ? (
                  <Image
                    src={data.coverUrl}
                    alt={data.title}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-[1.02]"
                    priority
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-gray-400">
                    بدون کاور
                  </div>
                )}
              </div>
            </div>

            {/* باکس اشتراک‌گذاری (کلاینت) */}
            <ShareBox slug={slug} title={data.title} />

            {/* ۳ پست آخر – دسکتاپ */}
            <RecentPosts
              posts={(recent as MiniPost[]) ?? []}
              className="mt-4 hidden md:block"
            />
          </div>
        </aside>

        {/* متن */}
        <section className="order-2 md:order-1 md:col-span-3">
          <div className="rounded-2xl bg-white shadow ring-1 ring-black/5">
            <div className="p-6 sm:p-8">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
                {data.title}
              </h1>
              {faDate && (
                <span className="mt-2 inline-block text-xs text-gray-500">
                  {faDate}
                </span>
              )}
            </div>

            <div className="p-6 sm:p-8">
              <div
                className="
                  prose prose-sm lg:prose-base max-w-none text-justify leading-8
                  prose-headings:text-gray-900 prose-p:text-gray-700
                  prose-a:text-emerald-700 hover:prose-a:text-emerald-800
                  prose-strong:font-extrabold
                  prose-img:rounded-xl prose-img:border prose-img:mx-auto
                "
                dangerouslySetInnerHTML={{ __html: safeHtml }}
              />
            </div>
          </div>

          {/* ۳ پست آخر – موبایل (ته صفحه) */}
          <RecentPosts
            posts={(recent as MiniPost[]) ?? []}
            className="mt-8 md:hidden"
          />
        </section>
      </div>
    </article>
  );
}
