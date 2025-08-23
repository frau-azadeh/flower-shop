"use client";

import { X } from "lucide-react";
import FiltersPanel from "./FiltersPanel";

type Range = { min: number | null; max: number | null };

type Props = {
  open: boolean;
  onClose: () => void;
  categories: string[];
  selectedCats: string[];
  toggleCat: (c: string) => void;
  onClearFilters: () => void;
  min: number | undefined;
  max: number | undefined;
  setMin: (n: number | undefined) => void;
  setMax: (n: number | undefined) => void;
  range: Range;
  onApply: () => void;
};

export default function MobileDrawer({
  open,
  onClose,
  categories,
  selectedCats,
  toggleCat,
  onClearFilters,
  min,
  max,
  setMin,
  setMax,
  range,
  onApply,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] rounded-t-2xl bg-white p-4 shadow-xl">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-sm font-semibold">فیلترها</h4>
          <button
            className="rounded-lg border px-2 py-1 text-xs"
            onClick={onClose}
          >
            <X className="size-4" />
          </button>
        </div>

        <FiltersPanel
          categories={categories}
          selectedCats={selectedCats}
          toggleCat={toggleCat}
          onClearFilters={onClearFilters}
          min={min}
          max={max}
          setMin={setMin}
          setMax={setMax}
          range={range}
        />

        <div className="mt-4 flex items-center justify-between">
          <button
            className="rounded-lg border px-3 py-2 text-sm"
            onClick={onClearFilters}
          >
            پاک‌کردن
          </button>
          <button
            className="rounded-lg bg-accent px-3 py-2 text-sm text-white"
            onClick={onApply}
          >
            اعمال فیلتر
          </button>
        </div>
      </div>
    </div>
  );
}
