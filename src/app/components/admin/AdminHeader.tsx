"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AdminHeader() {
  const [open, setOpen] = useState(false);

  const item =
    "block rounded-lg px-3 py-2 text-sm hover:bg-muted hover:text-primary";

  return (
    <>
      {/* سایدبار دسکتاپ */}
      <aside className="hidden md:block border-l border-border bg-surface p-4 sticky top-0 h-screen w-[240px]">
        <div className="text-lg font-extrabold text-primary mb-3">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image src="/favicon.ico" alt="لوگو" width={32} height={32} />
            <span className="text-xl font-extrabold text-primary">
              پنل ادمین
            </span>
          </Link>
        </div>
        <nav className="space-y-2 text-sm">
          <a href="/admin/dashboard" className={item}>
            داشبورد
          </a>
          <a href="/admin/products" className={item}>
            محصولات
          </a>
          <a href="/admin/orders" className={item}>
            سفارش‌ها
          </a>
          <a href="/admin/users" className={item}>
            کاربران
          </a>
        </nav>
      </aside>

      {/* هدر موبایل/تبلت */}
      <header className="md:hidden sticky top-0 z-40 h-12 bg-surface border-b border-border px-3 flex items-center justify-between">
        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded-lg hover:bg-muted"
          aria-label="باز کردن منو"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image src="/favicon.ico" alt="لوگو" width={32} height={32} />
          <span className="text-xl font-extrabold text-primary">پنل ادمین</span>
        </Link>
        <span className="w-6" />
      </header>

      {/* لایه تیره پشت منو (موبایل) */}
      {open && (
        <button
          className="fixed inset-0 z-40 bg-black/35 md:hidden"
          onClick={() => setOpen(false)}
          aria-label="بستن منو"
        />
      )}

      {/* منوی کشویی موبایل/تبلت (از راست در RTL) */}
      <aside
        className={`fixed md:hidden z-50 inset-y-0 right-0 w-72 max-w-[85vw]
        bg-surface border-l border-border p-4 transition-transform
        ${open ? "translate-x-0" : "translate-x-full"}`}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="text-lg font-extrabold text-primary">پنل ادمین</div>
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-lg hover:bg-muted"
            aria-label="بستن"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="space-y-2 text-sm">
          <a
            href="/admin/dashboard"
            className={item}
            onClick={() => setOpen(false)}
          >
            داشبورد
          </a>
          <a
            href="/admin/products"
            className={item}
            onClick={() => setOpen(false)}
          >
            محصولات
          </a>
          <a
            href="/admin/orders"
            className={item}
            onClick={() => setOpen(false)}
          >
            سفارش‌ها
          </a>
          <a
            href="/admin/users"
            className={item}
            onClick={() => setOpen(false)}
          >
            کاربران
          </a>
        </nav>
      </aside>
    </>
  );
}
