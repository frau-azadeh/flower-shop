"use client";

import { FormEvent } from "react";

export type BlogFiltersState = {
  q: string;
  sort: "new" | "old";
  onlyCover: boolean;
  onlyLong: boolean;
};

type Props = {
  state: BlogFiltersState;
  setState: (next: BlogFiltersState) => void;
  onSubmit: (e: FormEvent) => void;
  onReset: () => void;
};

export default function BlogFilters({ state, setState, onSubmit, onReset }: Props) {
  const { q, sort, onlyCover, onlyLong } = state;

  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-3">
      {/* Search */}
      <div>
        <label className="sr-only">جستجو</label>
        <input
          value={q}
          onChange={(e) => setState({ ...state, q: e.target.value })}
          placeholder="جستجو در عنوان و متن مقاله…"
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
        />
      </div>

      {/* Chips + Sort + Actions */}
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={sort}
          onChange={(e) => setState({ ...state, sort: e.target.value as "new" | "old" })}
          className="shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary"
        >
          <option value="new">جدیدترین</option>
          <option value="old">قدیمی‌تر</option>
        </select>

        <button
          type="button"
          onClick={() => setState({ ...state, onlyCover: !onlyCover })}
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
          onClick={() => setState({ ...state, onlyLong: !onlyLong })}
          className={`shrink-0 rounded-xl border px-3 py-2 text-sm transition ${
            onlyLong
              ? "border-primary bg-primary/10 text-primary"
              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          }`}
        >
          مقالات بلند (۵+ دقیقه)
        </button>

        <div className="ms-auto flex w-full justify-stretch gap-2 sm:w-auto sm:justify-end">
          <button
            type="submit"
            className="flex-1 rounded-xl bg-primary px-3 py-2 text-sm text-white hover:opacity-90 sm:flex-none"
          >
            اعمال فیلتر
          </button>
          <button
            type="button"
            onClick={onReset}
            className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 sm:flex-none"
          >
            پاک‌کردن
          </button>
        </div>
      </div>
    </form>
  );
}
