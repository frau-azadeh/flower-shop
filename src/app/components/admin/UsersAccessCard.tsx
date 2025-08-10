// app/components/admin/UserAccessCard.tsx
"use client";

import { ReactNode, useState } from "react";
import {
  Search,
  UserPlus,
  X,
  ShieldCheck,
  FileText,
  Package,
  ShoppingBag,
  Users,
} from "lucide-react";

export default function UserAccessCard() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  return (
    <section dir="rtl" className="mx-auto max-w-6xl p-4 md:p-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6 text-right">
        {/* Header */}
        <div className="mb-5 flex flex-col-reverse gap-4 md:mb-6 md:flex-row md:items-center md:justify-between">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800">کاربران و سطح دسترسی</h2>
          <div className="flex items-center gap-2">
            <label className="relative w-52 md:w-72">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="جستجو (نام یا ایمیل)"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-4 pl-10 text-sm outline-none transition focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-500" />
            </label>

            <button
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-3 py-2 text-sm text-white hover:opacity-90"
              type="button"
            >
              <UserPlus className="size-4" />
              افزودن کاربر
            </button>
          </div>
        </div>

        {/* Table (empty UI) */}
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
              <tr>
                <td colSpan={5} className="py-16">
                  <EmptyUsers />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Cards (mobile) */}
        <div className="md:hidden">
          <EmptyUsers />
        </div>

        {open && <NewUserModal onClose={() => setOpen(false)} />}
      </div>
    </section>
  );
}

function EmptyUsers() {
  return (
    <div className="flex flex-col items-center justify-center py-6 text-center">
      <Users className="size-14 text-slate-300" />
      <p className="mt-3 text-sm md:text-base text-slate-700">
        هنوز کاربری ثبت نشده است.
      </p>
      <p className="mt-1 text-xs text-slate-500">از دکمه «افزودن کاربر» استفاده کنید.</p>
    </div>
  );
}

function NewUserModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  // فقط UI (ذخیره واقعی نداریم)
  const [blog, setBlog] = useState(true);
  const [commerce, setCommerce] = useState(false);

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/40 p-3">
      <div className="w-full md:max-w-xl rounded-2xl bg-white shadow-xl p-4 md:p-6">
        {/* Title */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-700">
            <ShieldCheck className="size-5 text-accent" />
            <h3 className="font-semibold">افزودن کاربر</h3>
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

        {/* Form (UI Only) */}
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault(); // فقط UI
            onClose();
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="mb-1 block text-xs text-slate-600">نام و نام خانوادگی</span>
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
              title="فقط UI — بعداً ذخیره‌سازی را وصل کن"
            >
              ذخیره کاربر
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

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
