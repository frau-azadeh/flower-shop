"use client";

import { useEffect, useMemo, useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BlogFilters, { BlogFiltersState } from "./components/BlogFilters";
import FeatureCard from "./components/FeatureCard";
import PostCard from "./components/PostCard";
import Pagination from "./components/Pagination";
import ResultCount from "./components/ResultCount";
import EmptyState from "./components/EmptyState";
import { PostRow } from "@/types/blog";
import { POSTS_PER_PAGE, stripHtml } from "@/lib/blog/utils";

export default function BlogIndexClient({ posts, page }: { posts: PostRow[]; page: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initial: BlogFiltersState = {
    q: searchParams.get("q") ?? "",
    sort: ((searchParams.get("sort") ?? "new") as "new" | "old"),
    onlyCover: (searchParams.get("cover") ?? "0") === "1",
    onlyLong: (searchParams.get("long") ?? "0") === "1",
  };

  const [filters, setFilters] = useState<BlogFiltersState>(initial);
  const [currentPage, setCurrentPage] = useState<number>(page);
  useEffect(() => setCurrentPage(page), [page]);

  const filtered = useMemo(() => {
    const term = filters.q.trim().toLowerCase();

    const arr = posts
      .filter((p) => {
        const plain = stripHtml(p.content);
        const matches =
          term.length === 0 ||
          p.title.toLowerCase().includes(term) ||
          plain.toLowerCase().includes(term);
        if (!matches) return false;
        if (filters.onlyCover && !p.coverUrl) return false;
        if (filters.onlyLong) {
          const words = plain.split(/\s+/).filter(Boolean).length;
          if (Math.ceil(words / 200) < 5) return false;
        }
        return true;
      })
      .sort((a, b) => {
        const da = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const db = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        return filters.sort === "new" ? db - da : da - db;
      });

    return arr;
  }, [posts, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE));
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const pageItems = filtered.slice(startIndex, startIndex + POSTS_PER_PAGE);
  const [featured, ...rest] = pageItems;

  const buildQS = (nextPage: number) => {
    const u = new URLSearchParams();
    const { q, sort, onlyCover, onlyLong } = filters;
    if (q.trim()) u.set("q", q.trim());
    if (sort !== "new") u.set("sort", sort);
    if (onlyCover) u.set("cover", "1");
    if (onlyLong) u.set("long", "1");
    u.set("page", String(nextPage));
    return `?${u.toString()}`;
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    router.push(buildQS(1));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    const clean: BlogFiltersState = { q: "", sort: "new", onlyCover: false, onlyLong: false };
    setFilters(clean);
    router.push("?page=1");
    setCurrentPage(1);
  };

  return (
    <main dir="rtl" className="mt-12 bg-gradient-to-b from-white to-slate-50">
      <header className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-6 backdrop-blur sm:px-6">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            مجلهٔ گل‌فروش
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            نکات نگهداری، ایده‌های دیزاین و معرفی گل‌ها — هر هفته با مقاله‌های جدید.
          </p>

          <BlogFilters state={filters} setState={setFilters} onSubmit={onSubmit} onReset={resetFilters} />

          <ResultCount count={filtered.length} />
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {featured && <FeatureCard post={featured} />}

            <ul className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grid-flow-row-dense gap-6 sm:gap-7">
              {(featured ? rest : pageItems).map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </ul>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              buildQS={buildQS}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </section>
    </main>
  );
}
