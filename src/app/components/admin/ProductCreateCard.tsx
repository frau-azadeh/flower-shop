// app/components/admin/ProductCreateCard.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Package, Tag, DollarSign, Percent, Layers,
  Eye, Save, ImagePlus, Upload, CheckCircle2
} from "lucide-react";

export default function ProductCreateCard() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState<string>("");
  const [salePrice, setSalePrice] = useState<string>("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState<string>("0");
  const [active, setActive] = useState(true);
  const [description, setDescription] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>("");

  const fileRef = useRef<HTMLInputElement | null>(null);

  // ساخت اسلاگ ساده از روی نام (قابل ویرایش)
  useEffect(() => {
    if (!name) return setSlug("");
    setSlug(slugify(name));
  }, [name]);

  useEffect(() => {
    if (!coverFile) { setCoverPreview(""); return; }
    const url = URL.createObjectURL(coverFile);
    setCoverPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [coverFile]);

  const priceLabel = useMemo(() => {
    const p = Number(price || 0);
    return p > 0 ? p.toLocaleString() + " تومان" : "—";
  }, [price]);

  const saleLabel = useMemo(() => {
    const s = Number(salePrice || 0);
    return s > 0 ? s.toLocaleString() + " تومان" : "—";
  }, [salePrice]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // فعلاً فقط UI
  };

  return (
    <section dir="rtl" className="mx-auto max-w-6xl p-4 md:p-6">
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-slate-600">
          <Package className="size-5" />
          <span className="text-sm">افزودن محصول جدید</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
            title="پیش‌نمایش (فقط UI)"
          >
            <Eye className="size-4" />
            پیش‌نمایش
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
            title="ذخیره پیش‌نویس (فقط UI)"
          >
            <Save className="size-4" />
            ذخیره پیش‌نویس
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-3 py-2 text-sm text-white hover:opacity-90"
            title="انتشار (فقط UI)"
          >
            <Upload className="size-4" />
            انتشار
          </button>
        </div>
      </div>

      {/* Card */}
      <form
        onSubmit={onSubmit}
        className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_300px]"
      >
        {/* Main */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6">
          {/* name */}
          <label className="block">
            <span className="mb-1 block text-xs text-slate-600">نام محصول</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثلاً: دسته گل لاله زرد"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </label>

          {/* slug */}
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-slate-500">اسلاگ:</span>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
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
                onChange={(e) => setPrice(e.target.value)}
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
                onChange={(e) => setSalePrice(e.target.value)}
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
                onChange={(e) => setCategory(e.target.value)}
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
                onChange={(e) => setStock(e.target.value)}
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
              onChange={(e) => setDescription(e.target.value)}
              placeholder="توضیحات محصول را بنویسید…"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm leading-7 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </label>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          {/* Cover */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <h4 className="mb-3 text-sm font-semibold text-slate-700">تصویر کاور</h4>
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
              >
                <ImagePlus className="size-4" />
                انتخاب تصویر
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
              />
            </div>
            <div className="mt-3">
              {coverPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={coverPreview}
                  alt=""
                  className="aspect-video w-full rounded-xl border border-slate-200 object-cover"
                />
              ) : (
                <div className="aspect-video w-full rounded-xl border border-dashed border-slate-200 bg-slate-50" />
              )}
            </div>
          </div>

          {/* Status */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <h4 className="mb-3 text-sm font-semibold text-slate-700">وضعیت</h4>
            <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 px-3 py-2">
              <span className="text-sm text-slate-700">فعال باشد</span>
              <span
                onClick={() => setActive(v => !v)}
                className={`inline-flex items-center gap-2 text-sm ${
                  active ? "text-emerald-600" : "text-slate-400"
                }`}
                role="switch"
                aria-checked={active}
              >
                <CheckCircle2 className="size-5" />
              </span>
            </label>
          </div>

          {/* Actions (UI فقط) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex flex-col gap-2">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
                title="ذخیره پیش‌نویس (UI)"
              >
                <Save className="size-4" />
                ذخیره پیش‌نویس
              </button>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-3 py-2 text-sm text-white hover:opacity-90"
                title="انتشار (UI)"
              >
                <Upload className="size-4" />
                انتشار محصول
              </button>
            </div>
          </div>
        </aside>
      </form>
    </section>
  );
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}
