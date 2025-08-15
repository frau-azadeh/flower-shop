"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, UserPlus, Pencil, Trash2, Check, Minus } from "lucide-react";

import type { AdminUser } from "@/types/admin";
import { deleteUser, listUsers } from "@/app/admin/users/actions";

import { canBlog, canProducts } from "./utils/roles";
import { useUsers } from "./hooks/useUsers";
import { NewUserModal } from "./NewUserModal";
import { EmptyUsers } from "./EmptyUsers";

export default function UserAccessCard() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AdminUser | null>(null);

  const { q, setQ, items, loading, upsertLocal, removeLocal } = useUsers({
    fetcher: listUsers,
    searchDebounceMs: 300,
  });

  const rows = useMemo(() => items, [items]);

  return (
    <section dir="rtl" className="mx-auto max-w-6xl p-4 md:p-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6 text-right">
        {/* Header */}
        <div className="mb-5 flex flex-col-reverse gap-4 md:mb-6 md:flex-row md:items-center md:justify-between">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800">
            کاربران و سطح دسترسی
          </h2>
          <div className="flex items-center gap-2">
            <label className="relative w-52 md:w-72">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="جستجو (نام)"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-4 pl-10 text-sm outline-none transition focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-500" />
            </label>

            <button
              onClick={() => {
                setEditing(null);
                setOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-3 py-2 text-sm text-white hover:opacity-90"
              type="button"
            >
              <UserPlus className="size-4" />
              افزودن کاربر
            </button>
          </div>
        </div>

        {/* Table (desktop) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-slate-500">
              <tr className="[&>th]:py-2 [&>th]:font-medium [&>th]:text-right">
                <th>نام</th>
                <th>ایمیل</th>
                <th>وبلاگ</th>
                <th>محصول + سفارش</th>
                <th className="text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    در حال بارگذاری…
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16">
                    <EmptyUsers />
                  </td>
                </tr>
              ) : (
                rows.map((u) => (
                  <tr key={u.id}>
                    <td className="py-2">
                      {u.firstName} {u.lastName}
                    </td>
                    <td className="py-2 text-slate-400">—</td>

                    {/* وبلاگ */}
                    <td className="py-2">
                      {canBlog(u.role) ? (
                        <Link
                          href="/admin/blog"
                          className="inline-flex items-center gap-1 rounded-lg border px-2 py-1 hover:bg-slate-50"
                        >
                          <Check className="size-4 text-green-600" />
                          <span>باز کردن</span>
                        </Link>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-400">
                          <Minus className="size-4" /> ندارد
                        </span>
                      )}
                    </td>

                    {/* محصول + سفارش */}
                    <td className="py-2">
                      {canProducts(u.role) ? (
                        <div className="flex items-center gap-2">
                          <Link
                            href="/admin/products"
                            className="rounded-lg border px-2 py-1 hover:bg-slate-50"
                          >
                            محصول
                          </Link>
                          <Link
                            href="/admin/orders"
                            className="rounded-lg border px-2 py-1 hover:bg-slate-50"
                          >
                            سفارش
                          </Link>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-400">
                          <Minus className="size-4" /> ندارد
                        </span>
                      )}
                    </td>

                    <td className="py-2">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className="rounded-xl border border-slate-200 px-2 py-1 hover:bg-slate-50"
                          onClick={() => {
                            setEditing(u);
                            setOpen(true);
                          }}
                          title="ویرایش"
                        >
                          <Pencil className="size-4" />
                        </button>
                        <button
                          className="rounded-xl border border-slate-200 px-2 py-1 text-red-600 hover:bg-red-50"
                          onClick={async () => {
                            if (confirm("حذف این کاربر؟")) {
                              await deleteUser(u.id);
                              removeLocal(u.id);
                            }
                          }}
                          title="حذف"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Cards (mobile) */}
        <div className="md:hidden">
          {loading ? (
            <div className="py-8 text-center text-sm">در حال بارگذاری…</div>
          ) : rows.length === 0 ? (
            <EmptyUsers />
          ) : (
            <div className="space-y-3">
              {rows.map((u) => (
                <div key={u.id} className="rounded-xl border p-3">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">
                      {u.firstName} {u.lastName}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="rounded border px-2 py-1"
                        onClick={() => {
                          setEditing(u);
                          setOpen(true);
                        }}
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        className="rounded border px-2 py-1 text-red-600"
                        onClick={async () => {
                          if (confirm("حذف این کاربر؟")) {
                            await deleteUser(u.id);
                            removeLocal(u.id);
                          }
                        }}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>وبلاگ</span>
                      {canBlog(u.role) ? (
                        <Link href="/admin/blog" className="underline">
                          باز کردن
                        </Link>
                      ) : (
                        <span className="text-slate-400">ندارد</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span>محصول + سفارش</span>
                      {canProducts(u.role) ? (
                        <div className="space-x-2 space-x-reverse">
                          <Link href="/admin/products" className="underline">
                            محصول
                          </Link>
                          <Link href="/admin/orders" className="underline">
                            سفارش
                          </Link>
                        </div>
                      ) : (
                        <span className="text-slate-400">ندارد</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {open && (
          <NewUserModal
            onClose={() => setOpen(false)}
            initial={editing}
            onSaved={(saved) => {
              setOpen(false);
              upsertLocal(saved);
            }}
          />
        )}
      </div>
    </section>
  );
}
