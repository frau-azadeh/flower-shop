"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Package, Eye, Save, Upload } from "lucide-react";

import ProductMainForm from "@/app/components/admin/product/ProductMainForm";
import ProductCoverCard from "@/app/components/admin/product/ProductCoverCard";
import ProductStatusCard from "@/app/components/admin/product/ProductStatusCard";
import ProductActionsCard from "@/app/components/admin/product/ProductActionsCard";
import ProductListCard from "@/app/components/admin/product/ProductListCard";

import { Product, ListResponse } from "@/types/admin";
import { slugify } from "@/app/components/admin/product/utils";

const PAGE_SIZE = 20;

export default function ProductCreateCard() {
  // ----------- form state -----------
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
  const [editingId, setEditingId] = useState<string | null>(null);

  // ----------- list state -----------
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  // ----------- effects -----------
  useEffect(() => {
    setSlug(name ? slugify(name) : "");
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
    void loadProducts({ page: 1 });
  }, []);

  // ----------- helpers -----------
  async function loadProducts(opts?: { page?: number; q?: string }) {
    setLoadingList(true);
    try {
      const p = opts?.page ?? page;
      const query = opts?.q ?? q;
      const res = await fetch(
        `/api/admin/product/list?page=${p}&limit=${PAGE_SIZE}&includeInactive=true${query ? `&q=${encodeURIComponent(query)}` : ""}`,
        { credentials: "include" },
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
    setDescription(p.description ?? "");
    setCoverFile(null);
    setCoverPreview(p.coverUrl ?? "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ----------- submit create/update -----------
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
    if (s !== undefined && (!Number.isFinite(s) || s < 0))
      return alert("قیمت فروش نامعتبر");
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
      const res = await fetch(url, {
        method: "POST",
        body: fd,
        credentials: "include",
      });

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

  // ----------- row actions -----------
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

  // ----------- UI -----------
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

      {/* Form grid */}
      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_300px]">
        {/* left */}
        <ProductMainForm
          name={name}
          slug={slug}
          price={price}
          salePrice={salePrice}
          category={category}
          stock={stock}
          description={description}
          onChange={{
            name: setName,
            slug: setSlug,
            price: setPrice,
            salePrice: setSalePrice,
            category: setCategory,
            stock: setStock,
            description: setDescription,
          }}
        />

        {/* right (sidebar) */}
        <aside className="space-y-4">
          <ProductCoverCard coverPreview={coverPreview} inputRef={fileRef} onPick={setCoverFile} />
          <ProductStatusCard
            active={active}
            onToggle={() => setActive((v) => !v)}
            editing={editingId !== null}
            onCancelEdit={resetForm}
          />
          <ProductActionsCard submitting={submitting} editing={editingId !== null} />
        </aside>
      </form>

      {/* Product list */}
      <ProductListCard
        q={q}
        onChangeQ={setQ}
        onSearch={() => void loadProducts({ page: 1, q })}
        onClear={() => {
          setQ("");
          void loadProducts({ page: 1, q: "" });
        }}
        loading={loadingList}
        products={products}
        page={page}
        total={total}
        pageSize={PAGE_SIZE}
        onPageChange={(p) => void loadProducts({ page: p })}
        onEdit={fillFormFromProduct}
        onToggleActive={onToggleActive}
        onDelete={onDelete}
      />
    </section>
  );
}
