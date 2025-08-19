// app/blog/BlogIndexClient.tsx
"use client";

import { useEffect, useMemo, useState, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

/* ===== Types ===== */
type Row = {
  title: string;
  slug: string;
  content: string;        // HTML
  publishedAt: string | null;
  coverUrl: string | null;
};

const POSTS_PER_PAGE = 9;

/* ===== Utils ===== */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}
function readingTime(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}
function fmtDateFa(d: string | null): string {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString("fa-IR");
  } catch {
    return "";
  }
}

/* ===== Component ===== */
export default function BlogIndexClient({
  posts,
  page,
}: {
  posts: Row[];
  page: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // فیلترها از URL
  const q0 = searchParams.get("q") ?? "";
  const sort0 = (searchParams.get("sort") ?? "new") as "new" | "old";
  const cover0 = (searchParams.get("cover") ?? "0") === "1";
  const long0 = (searchParams.get("long") ?? "0") === "1";

  // State
  const [q, setQ] = useState<string>(q0);
  const [sort, setSort] = useState<"new" | "old">(sort0);
  const [onlyCover, setOnlyCover] = useState<boolean>(cover0);
  const [onlyLong, setOnlyLong] = useState<boolean>(long0);
  const [currentPage, setCurrentPage] = useState<number>(page);

  useEffect(() => setCurrentPage(page), [page]);

  // اعمال فیلتر/سورت
  const filtered = useMemo(() => {
    const term = q.trim();
    let arr = posts.filter((p) => {
      const matches =
        term.length === 0 ||
        p.title.toLowerCase().includes(term.toLowerCase()) ||
        stripHtml(p.content).toLowerCase().includes(term.toLowerCase());
      if (!matches) return false;
      if (onlyCover && !p.coverUrl) return false;
      if (onlyLong && readingTime(stripHtml(p.content)) < 5) return false;
      return true;
    });

    arr = arr.sort((a, b) => {
      const da = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const db = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return sort === "new" ? db - da : da - db;
    });

    return arr;
  }, [posts, q, sort, onlyCover, onlyLong]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE));
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const pageItems = filtered.slice(startIndex, startIndex + POSTS_PER_PAGE);

  // کارت فیچر (فقط موبایل/تبلت)
  const [featured, ...rest] = pageItems;

  // ساخت QS
  const buildQS = (nextPage: number) => {
    const u = new URLSearchParams();
    if (q.trim()) u.set("q", q.trim());
    if (sort !== "new") u.set("sort", sort);
    if (onlyCover) u.set("cover", "1");
    if (onlyLong) u.set("long", "1");
    u.set("page", String(nextPage));
    return `?${u.toString()}`;
  };

  // Submit فیلتر
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    router.push(buildQS(1));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setQ("");
    setSort("new");
    setOnlyCover(false);
    setOnlyLong(false);
    router.push("?page=1");
    setCurrentPage(1);
  };

  return (
    <main dir="rtl" className="mt-12 bg-gradient-to-b from-white to-slate-50">
      {/* Hero + Filter bar */}
      <header className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-6 backdrop-blur sm:px-6">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            مجلهٔ گل‌فروش
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            نکات نگهداری، ایده‌های دیزاین و معرفی گل‌ها — هر هفته با مقاله‌های جدید.
          </p>

          {/* فرم فیلتر — کاملاً ریسپانسیو */}
          <form onSubmit={onSubmit} className="mt-4 space-y-3">
            {/* Row 1: سرچ (همیشه تمام عرض) */}
            <div>
              <label className="sr-only">جستجو</label>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="جستجو در عنوان و متن مقاله…"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
              />
            </div>

            {/* Row 2: چیپ‌ها + سورت + اعمال/پاک‌کردن */}
            <div className="flex flex-wrap items-center gap-2">
              {/* سورت */}
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as "new" | "old")}
                className="shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary"
              >
                <option value="new">جدیدترین</option>
                <option value="old">قدیمی‌تر</option>
              </select>

              {/* چیپ‌ها */}
              <button
                type="button"
                onClick={() => setOnlyCover((v) => !v)}
                className={`shrink-0 rounded-xl border px-3 py-2 text-sm transition ${
                  onlyCover
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                فقط دارای کاور
              </button>
              <button
                type="button"
                onClick={() => setOnlyLong((v) => !v)}
                className={`shrink-0 rounded-xl border px-3 py-2 text-sm transition ${
                  onlyLong
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                مقالات بلند (۵+ دقیقه)
              </button>

              {/* دکمه‌ها */}
              <div className="ms-auto flex w-full justify-stretch gap-2 sm:w-auto sm:justify-end">
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-primary px-3 py-2 text-sm text-white hover:opacity-90 sm:flex-none"
                >
                  اعمال فیلتر
                </button>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 sm:flex-none"
                >
                  پاک‌کردن
                </button>
              </div>
            </div>
          </form>

          {/* شمارنده نتیجه */}
          <div className="mt-2 text-xs text-slate-500">
            {filtered.length.toLocaleString("fa-IR")} نتیجه یافت شد
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Empty state */}
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
            موردی مطابق جستجو پیدا نشد.
          </div>
        ) : (
          <>
            {/* Feature Card — فقط موبایل/تبلت؛ روی دسکتاپ پنهان تا گرید ۴ستونه خالی نشود */}
            {featured && (
              <Link
                href={`/blog/${featured.slug}`}
                className="group relative mb-6 block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-lg lg:hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr]">
                  <div className="relative aspect-[16/10] md:aspect-auto">
                    {featured.coverUrl ? (
                      <Image
                        src={featured.coverUrl}
                        alt={featured.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 60vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-slate-100 text-xs text-slate-400">
                        بدون کاور
                      </div>
                    )}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>
                  <div className="p-5">
                    <div className="mb-1 text-xs text-slate-500">
                      {fmtDateFa(featured.publishedAt)} ·{" "}
                      {readingTime(stripHtml(featured.content))} دقیقه مطالعه
                    </div>
                    <h2 className="line-clamp-2 text-lg font-extrabold text-slate-900">
                      {featured.title}
                    </h2>
                    <p className="mt-2 line-clamp-3 text-justify text-sm leading-7 text-slate-600">
                      {(() => {
                        const plain = stripHtml(featured.content);
                        return plain.length > 240 ? plain.slice(0, 240) + "…" : plain;
                      })()}
                    </p>
                    <span className="mt-4 inline-block text-[13px] font-medium text-primary">
                      مطالعه ↗
                    </span>
                  </div>
                </div>
              </Link>
            )}

            {/* Grid — دسکتاپ ۴ ستونه + dense برای پر کردن خلا */}
            <ul className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grid-flow-row-dense gap-6 sm:gap-7">
              {(featured ? rest : pageItems).map((p) => {
                const plain = stripHtml(p.content);
                const excerpt = plain.length > 200 ? plain.slice(0, 200) + "…" : plain;
                return (
                  <li
                    key={p.slug}
                    className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      {p.coverUrl ? (
                        <Image
                          src={p.coverUrl}
                          alt={p.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-slate-100 text-xs text-slate-400">
                          بدون کاور
                        </div>
                      )}
                      <div className="absolute bottom-3 right-3 flex items-center gap-2">
                        <span className="rounded-full bg-white/90 px-2 py-1 text-[11px] text-slate-700 shadow-sm backdrop-blur">
                          {fmtDateFa(p.publishedAt)}
                        </span>
                        <span className="rounded-full bg-white/90 px-2 py-1 text-[11px] text-slate-700 shadow-sm backdrop-blur">
                          {readingTime(plain)} دقیقه
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <Link
                        href={`/blog/${p.slug}`}
                        className="line-clamp-2 text-[15px] font-bold text-slate-900 transition-colors hover:text-primary"
                      >
                        {p.title}
                      </Link>
                      <p className="mt-2 line-clamp-3 text-justify text-sm leading-7 text-slate-600">
                        {excerpt}
                      </p>

                      <div className="mt-4 flex items-center justify-between">
                        <Link
                          href={`/blog/${p.slug}`}
                          className="inline-flex items-center gap-1 text-[13px] font-medium text-primary transition-all hover:gap-1.5"
                        >
                          مطالعه
                          <span aria-hidden>↗</span>
                        </Link>
                        <span className="text-[10px] text-slate-400">● ● ●</span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* صفحه‌بندی به سبک محصولات */}
            <div className="mt-8 flex flex-col items-center justify-between gap-3 text-sm text-slate-600 sm:flex-row">
              <span>
                صفحه {currentPage} از {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={buildQS(Math.max(1, currentPage - 1))}
                  onClick={(e) => {
                    e.preventDefault();
                    const p = Math.max(1, currentPage - 1);
                    router.push(buildQS(p));
                    setCurrentPage(p);
                  }}
                  className={`rounded-lg border px-3 py-1.5 ${
                    currentPage <= 1 ? "pointer-events-none opacity-50" : ""
                  }`}
                >
                  قبلی
                </a>
                <a
                  href={buildQS(Math.min(totalPages, currentPage + 1))}
                  onClick={(e) => {
                    e.preventDefault();
                    const p = Math.min(totalPages, currentPage + 1);
                    router.push(buildQS(p));
                    setCurrentPage(p);
                  }}
                  className={`rounded-lg border px-3 py-1.5 ${
                    currentPage >= totalPages ? "pointer-events-none opacity-50" : ""
                  }`}
                >
                  بعدی
                </a>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
