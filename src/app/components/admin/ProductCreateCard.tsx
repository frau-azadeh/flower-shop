// app/components/admin/ProductCreateCard.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Package,
  Tag,
  DollarSign,
  Percent,
  Layers,
  Eye,
  Save,
  ImagePlus,
  Upload,
  CheckCircle2,
  Pencil,
  Trash2,
  ToggleRight,
  ToggleLeft,
  Search,
} from "lucide-react";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice: number | null;
  category: string;
  stock: number;
  active: boolean;
  coverUrl: string | null;
  createdAt: string;
  description: string | null; // 👈 اضافه شد
};

type ListResponse = {
  ok: boolean;
  items: Product[];
  page: number;
  pageSize: number;
  total: number;
  message?: string;
};

export default function ProductCreateCard() {
  // -------------------- Create/Edit form state --------------------
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
  const [submitting, setSubmitting] = useState(false);

  // اگر روی ویرایش کلیک شود، این مقدار پر می‌شود
  const [editingId, setEditingId] = useState<string | null>(null);

  // -------------------- List state --------------------
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 20;

  // -------------------- Effects --------------------
  useEffect(() => {
    if (!name) return setSlug("");
    setSlug(slugify(name));
  }, [name]);

  useEffect(() => {
    if (!coverFile) {
      setCoverPreview("");
      return;
    }
    const url = URL.createObjectURL(coverFile);
    setCoverPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [coverFile]);

  useEffect(() => {
    void loadProducts({ page: 1 }); // اولین بار
  }, []);

  // -------------------- Derived labels --------------------
  const priceLabel = useMemo(() => {
    const p = Number(price || 0);
    return p > 0 ? p.toLocaleString() + " تومان" : "—";
  }, [price]);

  const saleLabel = useMemo(() => {
    const s = Number(salePrice || 0);
    return s > 0 ? s.toLocaleString() + " تومان" : "—";
  }, [salePrice]);

  // -------------------- Helpers --------------------
  async function loadProducts(opts?: { page?: number; q?: string }) {
    setLoadingList(true);
    try {
      const p = opts?.page ?? page;
      const query = opts?.q ?? q;
      const res = await fetch(
        `/api/admin/product/list?page=${p}&limit=${pageSize}&includeInactive=true${query ? `&q=${encodeURIComponent(query)}` : ""}`,
        { credentials: "include" }
      );
      const json: ListResponse = await res.json();
      if (!json.ok) {
        alert(json.message ?? "خطا در دریافت لیست");
        return;
      }
      setProducts(json.items);
      setTotal(json.total);
      setPage(json.page);
    } catch {
      alert("خطا در ارتباط با سرور (لیست)");
    } finally {
      setLoadingList(false);
    }
  }

  function resetForm() {
    setName("");
    setSlug("");
    setPrice("");
    setSalePrice("");
    setCategory("");
    setStock("0");
    setActive(true);
    setDescription("");
    setCoverFile(null);
    setCoverPreview("");
    setEditingId(null);
  }

  function fillFormFromProduct(p: Product) {
    setEditingId(p.id);
    setName(p.name);
    setSlug(p.slug);
    setPrice(String(p.price));
    setSalePrice(p.salePrice != null ? String(p.salePrice) : "");
    setCategory(p.category);
    setStock(String(p.stock));
    setActive(p.active);
    setDescription(p.description ?? ""); // 👈 قبلاً خالی می‌گذاشتیم
    setCoverFile(null);
    setCoverPreview(p.coverUrl ?? "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // -------------------- Submit create/update --------------------
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (!name.trim() || !slug.trim() || !category.trim()) {
      alert("نام، اسلاگ و دسته‌بندی الزامی است");
      return;
    }

    const p = Number(price || 0);
    const s = salePrice ? Number(salePrice) : undefined;
    const st = Number(stock || 0);
    if (!Number.isFinite(p) || p < 0) return alert("قیمت نامعتبر");
    if (s !== undefined && (!Number.isFinite(s) || s < 0)) return alert("قیمت فروش نامعتبر");
    if (!Number.isFinite(st) || st < 0) return alert("موجودی نامعتبر");

    const fd = new FormData();
    if (editingId) fd.append("id", editingId);
    fd.append("name", name.trim());
    fd.append("slug", slug.trim());
    fd.append("price", String(p));
    fd.append("salePrice", salePrice);
    fd.append("category", category.trim());
    fd.append("stock", String(st));
    fd.append("active", active ? "true" : "false");
    fd.append("description", description ?? "");
    if (coverFile) fd.append("cover", coverFile);

    try {
      setSubmitting(true);
      const url = editingId ? "/api/admin/product/update" : "/api/admin/product/add";
      const res = await fetch(url, { method: "POST", body: fd, credentials: "include" });

      const json: { ok: boolean; message?: string } = await res.json();
      if (!json.ok) {
        alert(json.message ?? (editingId ? "خطا در ویرایش" : "خطا در ثبت محصول"));
        return;
      }

      alert(editingId ? "محصول ویرایش شد" : "محصول با موفقیت ثبت شد");
      resetForm();
      void loadProducts();
    } catch {
      alert("خطای شبکه");
    } finally {
      setSubmitting(false);
    }
  };

  // -------------------- Row actions --------------------
  async function onToggleActive(p: Product) {
    try {
      const res = await fetch("/api/admin/product/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id: p.id, active: !p.active }),
      });
      const json: { ok: boolean; message?: string } = await res.json();
      if (!json.ok) return alert(json.message ?? "خطا در تغییر وضعیت");
      void loadProducts();
    } catch {
      alert("خطای شبکه");
    }
  }

  async function onDelete(p: Product) {
    if (!confirm(`حذف "${p.name}" قطعی است؟`)) return;
    try {
      const res = await fetch("/api/admin/product/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id: p.id }),
      });
      const json: { ok: boolean; message?: string } = await res.json();
      if (!json.ok) return alert(json.message ?? "حذف ناموفق");
      void loadProducts();
    } catch {
      alert("خطای شبکه");
    }
  }

  // -------------------- UI --------------------
  return (
    <section dir="rtl" className="mx-auto max-w-6xl p-4 md:p-6">
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-slate-600">
          <Package className="size-5" />
          <span className="text-sm">{editingId ? "ویرایش محصول" : "افزودن محصول جدید"}</span>
        </div>

        {/* دکمه‌های نمونه (UI) */}
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
            {editingId ? "ثبت ویرایش" : "انتشار"}
          </button>
        </div>
      </div>

      {/* Card: Form */}
      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_300px]">
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
                onClick={() => setActive((v) => !v)}
                className={`inline-flex items-center gap-2 text-sm ${
                  active ? "text-emerald-600" : "text-slate-400"
                }`}
                role="switch"
                aria-checked={active}
              >
                <CheckCircle2 className="size-5" />
              </span>
            </label>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
                title="لغو ویرایش"
              >
                لغو ویرایش
              </button>
            )}
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
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-3 py-2 text-sm text-white hover:opacity-90 disabled:opacity-70"
                title={editingId ? "ثبت ویرایش" : "انتشار (UI)"}
              >
                <Upload className="size-4" />
                {submitting ? "در حال ارسال..." : editingId ? "ثبت ویرایش" : "انتشار محصول"}
              </button>
            </div>
          </div>
        </aside>
      </form>

      {/* -------------------- Product List -------------------- */}
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 md:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-slate-700">لیست محصولات</h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-2">
              <Search className="size-4 text-slate-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="جستجو: نام/اسلاگ/دسته‌بندی"
                className="min-w-[220px] bg-transparent py-2 text-sm outline-none"
              />
            </div>
            <button
              type="button"
              onClick={() => void loadProducts({ page: 1, q })}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
            >
              جستجو
            </button>
            <button
              type="button"
              onClick={() => {
                setQ("");
                void loadProducts({ page: 1, q: "" });
              }}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
            >
              پاک‌کردن
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-right text-sm">
            <thead>
              <tr className="border-b bg-slate-50 text-slate-600">
                <th className="px-3 py-2">کاور</th>
                <th className="px-3 py-2">نام</th>
                <th className="px-3 py-2">اسلاگ</th>
                <th className="px-3 py-2">قیمت</th>
                <th className="px-3 py-2">فروش</th>
                <th className="px-3 py-2">دسته</th>
                <th className="px-3 py-2">موجودی</th>
                <th className="px-3 py-2">وضعیت</th>
                <th className="px-3 py-2">اقدامات</th>
              </tr>
            </thead>
            <tbody>
              {loadingList ? (
                <tr>
                  <td colSpan={9} className="px-3 py-6 text-center text-slate-500">
                    در حال بارگذاری…
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-3 py-6 text-center text-slate-500">
                    محصولی یافت نشد
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="border-b last:border-b-0">
                    <td className="px-3 py-2">
                      {p.coverUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.coverUrl}
                          alt={p.name}
                          className="h-12 w-16 rounded-lg border object-cover"
                        />
                      ) : (
                        <div className="h-12 w-16 rounded-lg border bg-slate-50" />
                      )}
                    </td>
                    <td className="px-3 py-2">{p.name}</td>
                    <td className="px-3 py-2 text-slate-500">{p.slug}</td>
                    <td className="px-3 py-2">{p.price.toLocaleString()}</td>
                    <td className="px-3 py-2">{p.salePrice ? p.salePrice.toLocaleString() : "—"}</td>
                    <td className="px-3 py-2">{p.category}</td>
                    <td className="px-3 py-2">{p.stock}</td>
                    <td className="px-3 py-2">
                      {p.active ? (
                        <span className="rounded-full bg-emerald-50 px-2 py-1 text-[11px] text-emerald-700">
                          فعال
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] text-slate-600">
                          غیرفعال
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => fillFormFromProduct(p)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-xs hover:bg-slate-50"
                          title="ویرایش"
                        >
                          <Pencil className="size-4" />
                          ویرایش
                        </button>
                        <button
                          type="button"
                          onClick={() => void onToggleActive(p)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-xs hover:bg-slate-50"
                          title={p.active ? "غیرفعال کردن" : "فعال کردن"}
                        >
                          {p.active ? <ToggleLeft className="size-4" /> : <ToggleRight className="size-4" />}
                          {p.active ? "غیرفعال" : "فعال"}
                        </button>
                        <button
                          type="button"
                          onClick={() => void onDelete(p)}
                          className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                          title="حذف"
                        >
                          <Trash2 className="size-4" />
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination ساده */}
        <div className="mt-4 flex items-center justify-between text-xs text-slate-600">
          <span>
            صفحه {page} از {Math.max(1, Math.ceil(total / pageSize))}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => void loadProducts({ page: page - 1 })}
              className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-50"
            >
              قبلی
            </button>
            <button
              type="button"
              disabled={page >= Math.ceil(total / pageSize)}
              onClick={() => void loadProducts({ page: page + 1 })}
              className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-50"
            >
              بعدی
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
}
