"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Filter } from "lucide-react";

import FiltersPanel from "./components/FiltersPanel";
import ProductGrid from "./components/ProductGrid";
import MobileDrawer from "./components/MobileDrawer";

import type { InitialState, Item, BrowseRes, BrowseOk } from "@/types/product";

export default function ProductsBrowser({
  initial,
}: {
  initial?: InitialState;
}) {
  // ---------- filters state ----------
  const [q, setQ] = useState<string>(initial?.q ?? "");
  const [selectedCats, setSelectedCats] = useState<string[]>(
    initial?.categories ?? [],
  );
  const [min, setMin] = useState<number | undefined>(initial?.min);
  const [max, setMax] = useState<number | undefined>(initial?.max);

  // ---------- data state ----------
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(12);
  const [total, setTotal] = useState<number>(0);
  const [range, setRange] = useState<{
    min: number | null;
    max: number | null;
  }>({
    min: null,
    max: null,
  });
  const [loading, setLoading] = useState<boolean>(false);

  // mobile filter drawer
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  // ---------- helpers ----------
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const buildQuery = useCallback(
    (nextPage: number) => {
      const u = new URLSearchParams();
      if (q.trim()) u.set("q", q.trim());
      selectedCats.forEach((c) => u.append("category", c));
      if (min != null && min >= 0) u.set("min", String(min));
      if (max != null && max >= 0) u.set("max", String(max));
      u.set("page", String(nextPage));
      u.set("limit", String(pageSize));
      return u;
    },
    [q, selectedCats, min, max, pageSize],
  );

  // debounce
  const debounceRef = useRef<number | undefined>(undefined);
  const debounced = useCallback((fn: () => void, wait = 300) => {
    window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(fn, wait);
  }, []);

  // ---------- data fetch ----------
  const controllerRef = useRef<AbortController | null>(null);

  const load = useCallback(
    async (nextPage: number) => {
      setLoading(true);
      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;

      try {
        const res = await fetch(
          `/api/admin/product/browse?${buildQuery(nextPage).toString()}`,
          {
            cache: "no-store",
            signal: controller.signal,
          },
        );
        const json: BrowseRes = await res.json();

        if (!res.ok || !json.ok) {
          const msg =
            (json as { message?: string }).message ?? "خطا در دریافت محصولات";
          alert(msg);
          return;
        }

        const ok = json as BrowseOk;
        setItems(ok.items);
        setTotal(ok.total);
        setPage(ok.page);
        setPageSize(ok.pageSize);
        setCategories(ok.categories);
        setRange(ok.price);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          alert("خطا در ارتباط با سرور");
        }
      } finally {
        setLoading(false);
      }
    },
    [buildQuery],
  );

  // initial load
  useEffect(() => {
    void load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // filters changed -> reset page & fetch (debounced)
  useEffect(() => {
    debounced(() => {
      setPage(1);
      void load(1);
    });
  }, [q, selectedCats, min, max, debounced, load]);

  // ---------- UI helpers ----------
  const toggleCat = useCallback((c: string) => {
    setSelectedCats((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
    );
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedCats([]);
    setMin(undefined);
    setMax(undefined);
    setQ("");
    setPage(1);
    void load(1);
  }, [load]);

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
        <ProductGrid items={items} loading={loading} />

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
            onClearFilters={clearFilters}
            min={min}
            max={max}
            setMin={setMin}
            setMax={setMax}
            range={range}
          />
        </div>
      </aside>

      {/* mobile drawer */}
      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        categories={categories}
        selectedCats={selectedCats}
        toggleCat={toggleCat}
        onClearFilters={clearFilters}
        min={min}
        max={max}
        setMin={setMin}
        setMax={setMax}
        range={range}
        onApply={() => {
          setDrawerOpen(false);
          void load(1);
        }}
      />
    </div>
  );
}
