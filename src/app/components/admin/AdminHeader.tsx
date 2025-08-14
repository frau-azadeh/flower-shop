// app/components/admin/AdminHeader.tsx
"use client";

import { useState, Fragment } from "react";
import {
  LayoutDashboard,
  Menu,
  Newspaper,
  Package,
  Receipt,
  User,
  X,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store/store";
// import { logoutAdmin } from "@/store/store";
import { useRouter } from "next/navigation";

type Role = "FULL" | "BLOG" | "PRODUCTS";
type MenuItem = { id: string; label: string; href: string; icon: React.ReactNode };

function itemsForRole(role: Role): MenuItem[] {
  if (role === "FULL") {
    return [
      { id: "dash",  label: "داشبورد",  href: "/admin/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
      { id: "blog",  label: "وبلاگ",    href: "/admin/blog",       icon: <Newspaper className="w-4 h-4" /> },
      { id: "prod",  label: "محصولات",  href: "/admin/products",   icon: <Package className="w-4 h-4" /> },
      { id: "orders",label: "سفارش‌ها", href: "/admin/orders",     icon: <Receipt className="w-4 h-4" /> },
      { id: "users", label: "کاربران",  href: "/admin/users",      icon: <User className="w-4 h-4" /> },
    ];
  }
  if (role === "BLOG") {
    // داشبورد = همان صفحه وبلاگ
    return [
      { id: "dash-blog",  label: "داشبورد",  href: "/admin/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
      { id: "blog",      label: "وبلاگ",   href: "/admin/blog", icon: <Newspaper className="w-4 h-4" /> },
    ];
  }
  // PRODUCTS
  return [
    { id: "prod", label: "داشبورد",  href: "/admin/products", icon: <LayoutDashboard className="w-4 h-4" /> },
     { id: "dash-prod",  label: "داشبورد",  href: "/admin/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "orders",    label: "سفارش‌ها", href: "/admin/orders",   icon: <Receipt className="w-4 h-4" /> },
  ];
}

export default function AdminHeader() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const admin = useSelector((s: RootState) => s.admin);
  const role: Role = (admin.role ?? "FULL") as Role;

  const item = "block rounded-lg px-3 py-2 text-sm hover:bg-muted hover:text-primary";
  const menu = itemsForRole(role);

  // const handleLogout = () => {
  //   dispatch(logoutAdmin());
  //   router.replace("/admin/login");
  // };

  const NavLinks = ({ onItemClick }: { onItemClick?: () => void }) => (
    <Fragment>
      {menu.map((m) => (
        <Link
          key={m.id}               // کلید یکتا
          href={m.href}
          className={`${item} flex items-center gap-2`}
          onClick={onItemClick}
        >
          {m.icon}
          {m.label}
        </Link>
      ))}
      <button
        onClick={() => {
          // handleLogout();
          onItemClick?.();
        }}
        className={`${item} flex items-center gap-2 text-red-600 hover:text-red-700`}
      >
        <LogOut className="w-4 h-4" />
        خروج
      </button>
    </Fragment>
  );

  return (
    <>
      {/* سایدبار دسکتاپ */}
      <aside className="hidden md:block border-l border-border bg-surface p-4 sticky top-0 h-screen w-[240px]">
        <div className="text-lg font-extrabold text-primary mb-3">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image src="/favicon.ico" alt="لوگو" width={32} height={32} />
            <span className="text-xl font-extrabولد text-primary">پنل ادمین</span>
          </Link>
          {admin.isAuthenticated && (
            <div className="mt-2 text-xs text-muted-foreground">
              {admin.firstName} {admin.lastName}
            </div>
          )}
        </div>
        <nav className="space-y-2 text-sm">
          <NavLinks />
        </nav>
      </aside>

      {/* هدر موبایل/تبلت */}
      <header className="md:hidden sticky top-0 z-40 h-12 bg-surface border-b border-border px-3 flex items-center justify-between">
        <button onClick={() => setOpen(true)} className="p-2 rounded-lg hover:bg-muted" aria-label="باز کردن منو">
          <Menu className="w-5 h-5" />
        </button>
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image src="/favicon.ico" alt="لوگو" width={32} height={32} />
          <span className="text-xl font-extrabold text-primary">پنل ادمین</span>
        </Link>
        <span className="w-6" />
      </header>

      {/* بک‌دراپ منو موبایل */}
      {open && (
        <button className="fixed inset-0 z-40 bg-black/35 md:hidden" onClick={() => setOpen(false)} aria-label="بستن منو" />
      )}

      {/* منو موبایل */}
      <aside
        className={`fixed md:hidden z-50 inset-y-0 right-0 w-72 max-w-[85vw] bg-surface border-l border-border p-4 transition-transform ${open ? "translate-x-0" : "translate-x-full"}`}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="text-lg font-extrabold text-primary">پنل ادمین</div>
          <button onClick={() => setOpen(false)} className="p-2 rounded-lg hover:bg-muted" aria-label="بستن">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="space-y-2 text-sm">
          <NavLinks onItemClick={() => setOpen(false)} />
        </nav>
      </aside>
    </>
  );
}
