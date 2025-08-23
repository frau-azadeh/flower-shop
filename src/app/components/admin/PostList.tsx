"use client";

import { useMemo, useState } from "react";
import Input from "../ui/Input";

export type Status = "draft" | "published";

export interface PostRow {
  id: string;
  title: string;
  slug: string;
  status: Status;
  content: string;
  coverUrl?: string | null;
  created_at?: string | null;
  updatedAt?: string | null;
  publishedAt?: string | null;
}

type SortKey = "updated" | "created" | "title" | "status";

interface PostListProps {
  rows: PostRow[];
  loading: boolean;
  error?: string;
  onRefresh: () => void;
  onEdit: (row: PostRow) => void;
  onDelete: (row: PostRow) => void;
}

function ts(s?: string | null): number {
  return s ? new Date(s).getTime() : 0;
}

export default function PostList({
  rows,
  loading,
  error,
  onRefresh,
  onEdit,
  onDelete,
}: PostListProps) {
  const [q, setQ] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("updated");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    const list = query
      ? rows.filter(
          (r) =>
            r.title.toLowerCase().includes(query) ||
            r.slug.toLowerCase().includes(query),
        )
      : rows.slice();

    list.sort((a, b) => {
      if (sortBy === "title") {
        return a.title.localeCompare(b.title, "fa");
      }
      if (sortBy === "status") {
        // published قبل از draft
        if (a.status === b.status) return 0;
        return a.status === "published" ? -1 : 1;
      }
      if (sortBy === "created") {
        return ts(b.created_at) - ts(a.created_at); // جدیدتر اول
      }
      // default: updated (بیشترین lastActivity)
      const ax = Math.max(ts(a.updatedAt), ts(a.publishedAt), ts(a.created_at));
      const bx = Math.max(ts(b.updatedAt), ts(b.publishedAt), ts(b.created_at));
      return bx - ax;
    });

    return list;
  }, [rows, q, sortBy]);

  return (
    <section dir="rtl" className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 md:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-sm font-semibold text-slate-700">پست‌ها</h2>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-2">
            <svg className="size-4 text-slate-400" viewBox="0 0 24 24" fill="none">
              <path d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" />
            </svg>
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="جستجو: عنوان یا اسلاگ"
              className="min-w-[220px] bg-transparent py-2 text-sm outline-none"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none"
          >
            <option value="updated">مرتب‌سازی: آخرین تغییر</option>
            <option value="created">مرتب‌سازی: تاریخ ایجاد</option>
            <option value="title">مرتب‌سازی: عنوان</option>
            <option value="status">مرتب‌سازی: وضعیت</option>
          </select>

          <button
            onClick={onRefresh}
            disabled={loading}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50 disabled:opacity-60"
          >
            بروزرسانی
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          خطا: {error}
        </div>
      )}

      {/* حالت‌ها */}
      {loading && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-xl border border-slate-200 bg-slate-50"
            />
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          نتیجه‌ای یافت نشد.
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <li
              key={r.id}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:shadow-sm"
            >
              {/* کاور کوچک */}
              {r.coverUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={r.coverUrl}
                  alt=""
                  className="h-24 w-full object-cover"
                />
              ) : (
                <div className="h-24 w-full bg-slate-50" />
              )}

              <div className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="line-clamp-1 text-sm font-semibold text-slate-800">
                    {r.title}
                  </h3>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] ${
                      r.status === "published"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {r.status === "published" ? "منتشر شده" : "پیش‌نویس"}
                  </span>
                </div>

                <div className="mt-1 text-[12px] text-slate-500 ltr:font-mono">
                  /blog/{r.slug}
                </div>

                <div className="mt-3 flex items-center justify-end gap-3 text-xs">
                  <button
                    onClick={() => onEdit(r)}
                    className="text-blue-600 hover:underline"
                    title="ویرایش"
                  >
                    ویرایش
                  </button>
                  <button
                    onClick={() => onDelete(r)}
                    className="text-rose-600 hover:underline"
                    title="حذف"
                  >
                    حذف
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
