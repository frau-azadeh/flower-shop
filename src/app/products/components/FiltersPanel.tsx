"use client";

type Range = { min: number | null; max: number | null };

type Props = {
  categories: string[];
  selectedCats: string[];
  toggleCat: (c: string) => void;
  onClearFilters: () => void;
  min: number | undefined;
  max: number | undefined;
  setMin: (n: number | undefined) => void;
  setMax: (n: number | undefined) => void;
  range: Range;
};

export default function FiltersPanel({
  categories,
  selectedCats,
  toggleCat,
  onClearFilters,
  min,
  max,
  setMin,
  setMax,
  range,
}: Props) {
  return (
    <div
      className="rounded-2xl border border-slate-200 bg-white p-4
        max-h-[calc(100vh-8rem)] overflow-auto"
    >
      {/* دسته‌ها */}
      <div>
        <div className="mb-2 text-sm font-semibold text-slate-700">
          دسته‌بندی
        </div>
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
        <div className="mb-2 text-sm font-semibold text-slate-700">
          بازه قیمت (تومان)
        </div>
        <div className="max-h-40 overflow-auto pr-1">
          <div className="grid grid-cols-2 gap-2">
            <input
              inputMode="numeric"
              placeholder={range.min != null ? String(range.min) : "حداقل"}
              value={min ?? ""}
              onChange={(e) =>
                setMin(e.target.value ? Number(e.target.value) : undefined)
              }
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-accent"
            />
            <input
              inputMode="numeric"
              placeholder={range.max != null ? String(range.max) : "حداکثر"}
              value={max ?? ""}
              onChange={(e) =>
                setMax(e.target.value ? Number(e.target.value) : undefined)
              }
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
        <button
          className="rounded-lg border px-3 py-2 text-sm"
          onClick={onClearFilters}
        >
          پاک‌کردن
        </button>
        <span className="text-xs text-slate-400">
          تغییرات به‌صورت خودکار اعمال می‌شود
        </span>
      </div>
    </div>
  );
}
