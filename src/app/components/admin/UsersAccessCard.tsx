// app/components/admin/UserAccessCard.tsx
"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import {
  Search,
  UserPlus,
  X,
  ShieldCheck,
  FileText,
  Package,
  ShoppingBag,
  Users,
  Check,
  Minus,
  Pencil,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import type { AdminUser, AdminRole } from "@/types/admin";
import {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
} from "@/app/admin/users/actions";

// ---------- helpers ----------
function canBlog(role: AdminRole) {
  return role === "BLOG" || role === "FULL";
}
function canProducts(role: AdminRole) {
  return role === "PRODUCTS" || role === "FULL";
}
function roleFromToggles(blog: boolean, commerce: boolean): AdminRole {
  if (blog && commerce) return "FULL";
  if (blog) return "BLOG";
  if (commerce) return "PRODUCTS";
  return "BLOG";
}

// ---------- main component ----------
export default function UserAccessCard() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AdminUser | null>(null);

  const [items, setItems] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  async function load() {
    setLoading(true);
    const data = await listUsers(q);
    setItems(data);
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);
  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [q]);

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
                              setItems((prev) => prev.filter((x) => x.id !== u.id));
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
                            setItems((prev) => prev.filter((x) => x.id !== u.id));
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
              setItems((prev) => {
                const i = prev.findIndex((p) => p.id === saved.id);
                if (i >= 0) {
                  const copy = [...prev];
                  copy[i] = saved;
                  return copy;
                }
                return [saved, ...prev];
              });
            }}
          />
        )}
      </div>
    </section>
  );
}

// ---------- empty state ----------
function EmptyUsers() {
  return (
    <div className="flex flex-col items-center justify-center py-6 text-center">
      <Users className="size-14 text-slate-300" />
      <p className="mt-3 text-sm md:text-base text-slate-700">
        هنوز کاربری ثبت نشده است.
      </p>
      <p className="mt-1 text-xs text-slate-500">
        از دکمه «افزودن کاربر» استفاده کنید.
      </p>
    </div>
  );
}

// ---------- modal (همان استایل تو، اما وصل به CRUD) ----------
function NewUserModal({
  onClose,
  initial,
  onSaved,
}: {
  onClose: () => void;
  initial: AdminUser | null;
  onSaved: (u: AdminUser) => void;
}) {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>(""); // فقط UI
  const [blog, setBlog] = useState<boolean>(true);
  const [commerce, setCommerce] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");

  const isEdit = !!initial;

  useEffect(() => {
    if (initial) {
      setName(`${initial.firstName} ${initial.lastName}`);
      setBlog(canBlog(initial.role));
      setCommerce(canProducts(initial.role));
      setPassword("");
    } else {
      setName("");
      setEmail("");
      setBlog(true);
      setCommerce(false);
      setPassword("");
    }
  }, [initial]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmed = name.trim();
    if (!trimmed.includes(" ")) {
      alert("نام و نام خانوادگی را با فاصله وارد کنید.");
      return;
    }
    const [firstName, ...rest] = trimmed.split(" ");
    const lastName = rest.join(" ");
    const role = roleFromToggles(blog, commerce);

    if (isEdit && initial) {
      const saved = await updateUser(initial.id, {
        firstName,
        lastName,
        role,
        isActive: true,
        password: password ? password : undefined,
      });
      if (saved) onSaved(saved);
    } else {
      if (!password) {
        alert("رمز عبور الزامی است");
        return;
      }
      const saved = await createUser({
        firstName,
        lastName,
        password,
        role,
        isActive: true,
      });
      if (saved) onSaved(saved);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/40 p-3">
      <div className="w-full md:max-w-xl rounded-2xl bg-white shadow-xl p-4 md:p-6">
        {/* Title */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-700">
            <ShieldCheck className="size-5 text-accent" />
            <h3 className="font-semibold">{isEdit ? "ویرایش کاربر" : "افزودن کاربر"}</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-slate-100"
            aria-label="بستن"
            type="button"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="mb-1 block text-xs text-slate-600">
                نام و نام خانوادگی
              </span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثلاً: علی رضایی"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs text-slate-600">ایمیل</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </label>
          </div>

          {/* Permissions */}
          <div>
            <p className="mb-2 text-sm font-medium text-slate-700">دسترسی‌ها</p>
            <div className="space-y-2">
              <AccessSwitch
                checked={blog}
                onChange={setBlog}
                label="وبلاگ"
                iconLeft={<FileText className="size-4 text-slate-600" />}
              />
              <AccessSwitch
                checked={commerce}
                onChange={setCommerce}
                label="محصول + سفارش"
                iconLeft={
                  <span className="inline-flex items-center gap-1 text-slate-600">
                    <Package className="size-4" />
                    <ShoppingBag className="size-4" />
                  </span>
                }
              />
            </div>
          </div>

          {/* Password */}
          <label className="block">
            <span className="mb-1 block text-xs text-slate-600">
              {isEdit ? "تغییر رمز (اختیاری)" : "رمز عبور"}
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              required={!isEdit}
            />
          </label>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="rounded-xl bg-accent px-4 py-2 text-sm text-white hover:opacity-90"
            >
              {isEdit ? "ذخیره تغییرات" : "ذخیره کاربر"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---------- switch ----------
function AccessSwitch({
  checked,
  onChange,
  label,
  iconLeft,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  iconLeft?: ReactNode;
}) {
  return (
    <label className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
      <span className="flex items-center gap-2">
        {iconLeft}
        <span className="text-sm text-slate-800">{label}</span>
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
          checked ? "bg-accent" : "bg-slate-300"
        }`}
      >
        <span
          className={`h-5 w-5 rounded-full bg-white shadow transition ${
            checked ? "translate-x-5" : "translate-x-1"
          }`}
        />
      </button>
    </label>
  );
}
