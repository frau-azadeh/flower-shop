"use client";

import { DollarSign, Percent, Tag, Layers } from "lucide-react";
import { useMemo } from "react";

type Props = {
  name: string;
  slug: string;
  price: string;
  salePrice: string;
  category: string;
  stock: string;
  description: string;
  onChange: {
    name: (v: string) => void;
    slug: (v: string) => void;
    price: (v: string) => void;
    salePrice: (v: string) => void;
    category: (v: string) => void;
    stock: (v: string) => void;
    description: (v: string) => void;
  };
};

export default function ProductMainForm({
  name,
  slug,
  price,
  salePrice,
  category,
  stock,
  description,
  onChange,
}: Props) {
  const priceLabel = useMemo(() => {
    const p = Number(price || 0);
    return p > 0 ? p.toLocaleString() + " تومان" : "—";
  }, [price]);

  const saleLabel = useMemo(() => {
    const s = Number(salePrice || 0);
    return s > 0 ? s.toLocaleString() + " تومان" : "—";
  }, [salePrice]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6">
      {/* name */}
      <label className="block">
        <span className="mb-1 block text-xs text-slate-600">نام محصول</span>
        <input
          value={name}
          onChange={(e) => onChange.name(e.target.value)}
          placeholder="مثلاً: دسته گل لاله زرد"
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
      </label>

      {/* slug */}
      <div className="mt-3 flex items-center gap-2">
        <span className="text-xs text-slate-500">اسلاگ:</span>
        <input
          value={slug}
          onChange={(e) => onChange.slug(e.target.value)}
          placeholder="daste-gol-lale-zard"
          className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs outline-none focus:bg-white focus:border-accent"
        />
      </div>

      {/* pricing & stock */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 flex items-center gap-2 text-xs text-slate-600">
            <DollarSign className="size-4" />
            قیمت (تومان)
          </span>
          <input
            value={price}
            onChange={(e) => onChange.price(e.target.value)}
            inputMode="numeric"
            placeholder="مثلاً 450000"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
          <span className="mt-1 block text-[11px] text-slate-500">{priceLabel}</span>
        </label>

        <label className="block">
          <span className="mb-1 flex items-center gap-2 text-xs text-slate-600">
            <Percent className="size-4" />
            قیمت فروش (اختیاری)
          </span>
          <input
            value={salePrice}
            onChange={(e) => onChange.salePrice(e.target.value)}
            inputMode="numeric"
            placeholder="مثلاً 399000"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
          <span className="mt-1 block text-[11px] text-slate-500">{saleLabel}</span>
        </label>

        <label className="block">
          <span className="mb-1 flex items-center gap-2 text-xs text-slate-600">
            <Tag className="size-4" />
            دسته‌بندی
          </span>
          <input
            value={category}
            onChange={(e) => onChange.category(e.target.value)}
            placeholder="مثلاً: گل شاخه‌ای"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </label>

        <label className="block">
          <span className="mb-1 flex items-center gap-2 text-xs text-slate-600">
            <Layers className="size-4" />
            موجودی
          </span>
          <input
            value={stock}
            onChange={(e) => onChange.stock(e.target.value)}
            inputMode="numeric"
            placeholder="مثلاً 12"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </label>
      </div>

      {/* description */}
      <label className="mt-4 block">
        <span className="mb-1 block text-xs text-slate-600">توضیحات</span>
        <textarea
          rows={8}
          value={description}
          onChange={(e) => onChange.description(e.target.value)}
          placeholder="توضیحات محصول را بنویسید…"
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm leading-7 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
      </label>
    </div>
  );
}
