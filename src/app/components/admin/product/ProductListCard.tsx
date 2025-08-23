"use client";

import { Search, Pencil, ToggleLeft, ToggleRight, Trash2 } from "lucide-react";
import { Product } from "@/types/admin";

type Props = {
  q: string;
  onChangeQ: (v: string) => void;
  onSearch: () => void;
  onClear: () => void;

  loading: boolean;
  products: Product[];
  page: number;
  total: number;
  pageSize: number;

  onPageChange: (p: number) => void;
  onEdit: (p: Product) => void;
  onToggleActive: (p: Product) => void;
  onDelete: (p: Product) => void;
};

export default function ProductListCard({
  q,
  onChangeQ,
  onSearch,
  onClear,
  loading,
  products,
  page,
  total,
  pageSize,
  onPageChange,
  onEdit,
  onToggleActive,
  onDelete,
}: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 md:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-slate-700">لیست محصولات</h3>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-2">
            <Search className="size-4 text-slate-400" />
            <input
              value={q}
              onChange={(e) => onChangeQ(e.target.value)}
              placeholder="جستجو: نام/اسلاگ/دسته‌بندی"
              className="min-w-[220px] bg-transparent py-2 text-sm outline-none"
            />
          </div>
          <button
            type="button"
            onClick={onSearch}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
          >
            جستجو
          </button>
          <button
            type="button"
            onClick={onClear}
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
            {loading ? (
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
                        onClick={() => onEdit(p)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-xs hover:bg-slate-50"
                        title="ویرایش"
                      >
                        <Pencil className="size-4" />
                        ویرایش
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggleActive(p)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-xs hover:bg-slate-50"
                        title={p.active ? "غیرفعال کردن" : "فعال کردن"}
                      >
                        {p.active ? <ToggleLeft className="size-4" /> : <ToggleRight className="size-4" />}
                        {p.active ? "غیرفعال" : "فعال"}
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(p)}
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

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between text-xs text-slate-600">
        <span>
          صفحه {page} از {totalPages}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-50"
          >
            قبلی
          </button>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-50"
          >
            بعدی
          </button>
        </div>
      </div>
    </div>
  );
}
