"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Filter, X } from "lucide-react";
import ProductCard from "./ProductCard";

type Item = {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice: number | null;
  category: string;
  coverUrl: string | null;
  createdAt: string;
};

type BrowseOk = {
  ok: true;
  items: Item[];
  total: number;
  page: number;
  pageSize: number;
  categories: string[];
  price: { min: number | null; max: number | null };
};
type BrowseBad = { ok: false; message: string };
type BrowseRes = BrowseOk | BrowseBad;

type InitialState = {
  q?: string;
  categories?: string[];
  min?: number;
  max?: number;
};

export default function ProductsBrowser({ initial }: { initial?: InitialState }) {
  // ---------- filters state ----------
  const [q, setQ] = useState(initial?.q ?? "");
  const [selectedCats, setSelectedCats] = useState<string[]>(initial?.categories ?? []);
  const [min, setMin] = useState<number | undefined>(initial?.min);
  const [max, setMax] = useState<number | undefined>(initial?.max);

  // ---------- data state ----------
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [total, setTotal] = useState(0);
  const [range, setRange] = useState<{ min: number | null; max: number | null }>({ min: null, max: null });
  const [loading, setLoading] = useState(false);

  // mobile filter drawer
  const [drawerOpen, setDrawerOpen] = useState(false);

  // debounce سرچ
  const qRef = useRef<number | undefined>(undefined);
  function debouncedLoad(_page = 1) {
    window.clearTimeout(qRef.current);
    qRef.current = window.setTimeout(() => load(_page), 300);
  }

  // ساخت querystring
  const qs = useMemo(() => {
    const u = new URLSearchParams();
    if (q.trim()) u.set("q", q.trim());
    selectedCats.forEach((c) => u.append("category", c));
    if (min != null && min >= 0) u.set("min", String(min));
    if (max != null && max >= 0) u.set("max", String(max));
    u.set("page", String(page));
    u.set("limit", String(pageSize));
    return u.toString();
  }, [q, selectedCats, min, max, page, pageSize]);

  // fetcher
  async function load(nextPage = 1) {
    setLoading(true);
    try {
      const u = new URLSearchParams();
      if (q.trim()) u.set("q", q.trim());
      selectedCats.forEach((c) => u.append("category", c));
      if (min != null && min >= 0) u.set("min", String(min));
      if (max != null && max >= 0) u.set("max", String(max));
      u.set("page", String(nextPage));
      u.set("limit", String(pageSize));

      const res = await fetch(`/api/admin/product/browse?${u.toString()}`, { cache: "no-store" });
      const json: BrowseRes = await res.json();

      if (!json.ok) {
        alert(json.message ?? "خطا در دریافت محصولات");
        return;
      }
      setItems(json.items);
      setTotal(json.total);
      setPage(json.page);
      setPageSize(json.pageSize);
      setCategories(json.categories);
      setRange(json.price);
    } catch {
      alert("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // هر تغییری در فیلترها => صفحه 1 و fetch
  useEffect(() => {
    debouncedLoad(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, selectedCats, min, max]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // ---------- UI helpers ----------
  function toggleCat(c: string) {
    setSelectedCats((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  }

  function clearFilters() {
    setSelectedCats([]);
    setMin(undefined);
    setMax(undefined);
    setQ("");
    setPage(1);
    void load(1);
  }

  // ---------- UI ----------
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_280px]" dir="rtl">
      {/* main grid */}
      <div className="order-1 md:order-none">
        {/* جستجو + دکمه فیلتر موبایل */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="جستجو: نام / اسلاگ / دسته‌بندی"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <button
            className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm md:hidden"
            onClick={() => setDrawerOpen(true)}
            aria-label="فیلتر"
            title="فیلتر"
          >
            <Filter className="size-4" />
            فیلتر
          </button>
        </div>

        {/* گرید محصولات */}
        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl border border-slate-200 bg-white">
                <div className="aspect-[4/3] w-full rounded-t-2xl bg-slate-100" />
                <div className="p-3 space-y-2">
                  <div className="h-3 w-24 rounded bg-slate-100" />
                  <div className="h-4 w-40 rounded bg-slate-100" />
                  <div className="h-4 w-28 rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="text-slate-500">محصولی یافت نشد.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-3">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        {/* صفحه‌بندی */}
        <div className="mt-6 flex items-center justify-between text-sm text-slate-600">
          <span>
            صفحه {page} از {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => void load(Math.max(1, page - 1))}
              disabled={page <= 1 || loading}
              className="rounded-lg border px-3 py-1.5 disabled:opacity-50"
            >
              قبلی
            </button>
            <button
              onClick={() => void load(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages || loading}
              className="rounded-lg border px-3 py-1.5 disabled:opacity-50"
            >
              بعدی
            </button>
          </div>
        </div>
      </div>

      {/* sidebar (دسکتاپ) */}
     <aside className="hidden md:block">
        <div className="sticky top-24"> 
        <FiltersPanel
          categories={categories}
          selectedCats={selectedCats}
          toggleCat={toggleCat}
          clearFilters={clearFilters}
          min={min}
          max={max}
          setMin={setMin}
          setMax={setMax}
          range={range}
        />
        </div>
      </aside>

      {/* mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setDrawerOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] rounded-t-2xl bg-white p-4 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-sm font-semibold">فیلترها</h4>
              <button
                className="rounded-lg border px-2 py-1 text-xs"
                onClick={() => setDrawerOpen(false)}
              >
                <X className="size-4" />
              </button>
            </div>

            <FiltersPanel
              categories={categories}
              selectedCats={selectedCats}
              toggleCat={toggleCat}
              clearFilters={clearFilters}
              min={min}
              max={max}
              setMin={setMin}
              setMax={setMax}
              range={range}
            />

            <div className="mt-4 flex items-center justify-between">
              <button
                className="rounded-lg border px-3 py-2 text-sm"
                onClick={clearFilters}
              >
                پاک‌کردن
              </button>
              <button
                className="rounded-lg bg-accent px-3 py-2 text-sm text-white"
                onClick={() => {
                  setDrawerOpen(false);
                  void load(1);
                }}
              >
                اعمال فیلتر
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FiltersPanel(props: {
  categories: string[];
  selectedCats: string[];
  toggleCat: (c: string) => void;
  clearFilters: () => void;
  min: number | undefined;
  max: number | undefined;
  setMin: (n: number | undefined) => void;
  setMax: (n: number | undefined) => void;
  range: { min: number | null; max: number | null };
}) {
  const { categories, selectedCats, toggleCat, min, max, setMin, setMax, range } = props;
  return (
    <div className="  rounded-2xl border border-slate-200 bg-white p-4
        max-h-[calc(100vh-8rem)] overflow-auto">
      {/* دسته‌ها */}
      <div>
        <div className="mb-2 text-sm font-semibold text-slate-700">دسته‌بندی</div>
        <div className="max-h-60 overflow-auto pr-1">
          {categories.length === 0 ? (
            <div className="text-xs text-slate-500">دسته‌ای موجود نیست</div>
          ) : (
            <ul className="space-y-1">
              {categories.map((c) => (
                <li key={c}>
                  <label className="flex cursor-pointer items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedCats.includes(c)}
                      onChange={() => toggleCat(c)}
                      className="size-4 rounded border-slate-300"
                    />
                    <span>{c}</span>
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* قیمت */}
      <div className="mt-4">
        <div className="mb-2 text-sm font-semibold text-slate-700">بازه قیمت (تومان)</div>
        <div className="max-h-40 overflow-auto pr-1">
          <div className="grid grid-cols-2 gap-2">
            <input
              inputMode="numeric"
              placeholder={range.min != null ? String(range.min) : "حداقل"}
              value={min ?? ""}
              onChange={(e) => setMin(e.target.value ? Number(e.target.value) : undefined)}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-accent"
            />
            <input
              inputMode="numeric"
              placeholder={range.max != null ? String(range.max) : "حداکثر"}
              value={max ?? ""}
              onChange={(e) => setMax(e.target.value ? Number(e.target.value) : undefined)}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            {range.min != null && range.max != null
              ? `حداقل ${range.min.toLocaleString("fa-IR")} — حداکثر ${range.max.toLocaleString("fa-IR")}`
              : "حداقل و حداکثر قابل دسترس نمایش داده می‌شود"}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button className="rounded-lg border px-3 py-2 text-sm" onClick={props.clearFilters}>
          پاک‌کردن
        </button>
        <span className="text-xs text-slate-400">تغییرات به‌صورت خودکار اعمال می‌شود</span>
      </div>
    </div>
  );
}
