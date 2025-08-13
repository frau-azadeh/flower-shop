"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  Search,
  Heart,
  ShoppingBag,
  ChevronDown,
  User,
  LogOut,
} from "lucide-react";
import { createPortal } from "react-dom";
import clsx from "clsx";

import Button from "./Button";
import { createSupabaseClient } from "@/lib/supabase";
import { useAppSelector } from "@/store/hooks";

type NavItem = { label: string; href: string };

const NAV: NavItem[] = [
  { label: "صفحه اصلی", href: "/" },
  { label: "وبلاگ", href: "/blog" },
  { label: "درباره ما", href: "/about" },
  { label: "تماس با ما", href: "/contact" },
  { label: "گیاهان تخفیف‌خورده", href: "/deals" },
];

const CATEGORIES: NavItem[] = [
  { label: "گیاهان آپارتمانی", href: "/products/indoor" },
  { label: "گل شاخه‌ای", href: "/products/cut-flowers" },
  { label: "گلدان و لوازم", href: "/products/pots" },
  { label: "کاکتوس و ساکولنت", href: "/products/cactus" },
];

/* ---------- MobileMenu (Portal) ---------- */
function MobileMenu({
  open,
  onClose,
  isActive,
  isLoggedIn,
  fullName,
  onSignOut,
}: {
  open: boolean;
  onClose: () => void;
  isActive: (href: string) => boolean;
  isLoggedIn: boolean;
  fullName: string | null;
  onSignOut: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, mounted]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] bg-surface text-text md:hidden">
      {/* top bar */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        <span className="text-lg font-extrabold text-primary">منو</span>
        <Button
          className="p-2 rounded-full hover:bg-muted"
          onClick={onClose}
          aria-label="بستن"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* content */}
      <div className="h-[calc(100vh-4rem)] overflow-y-auto p-4 space-y-2">
        <Link
          href="/"
          onClick={onClose}
          className={clsx(
            "block px-3 py-2 rounded-lg text-sm font-semibold",
            isActive("/") ? "text-primary bg-muted" : "hover:bg-muted",
          )}
        >
          صفحه اصلی
        </Link>

        <details className="rounded-lg">
          <summary className="flex items-center justify-between cursor-pointer px-3 py-2 text-sm font-semibold hover:text-primary">
            محصولات <ChevronDown className="w-4 h-4" />
          </summary>
          <div className="mt-2 ps-3 flex flex-col gap-1">
            {CATEGORIES.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                onClick={onClose}
                className="block rounded-md px-2 py-1.5 text-sm hover:bg-muted hover:text-primary"
              >
                {c.label}
              </Link>
            ))}
          </div>
        </details>

        {NAV.slice(1).map((i) => (
          <Link
            key={i.href}
            href={i.href}
            onClick={onClose}
            className={clsx(
              "block px-3 py-2 rounded-lg text-sm font-semibold",
              isActive(i.href) ? "text-primary bg-muted" : "hover:bg-muted",
            )}
          >
            {i.label}
          </Link>
        ))}

        <div className="mt-4 border-t border-border pt-3 space-y-2">
          <Link
            href="/cart"
            onClick={onClose}
            className="flex items-center justify-between rounded-lg bg-muted px-3 py-2 text-sm"
          >
            <span className="font-semibold">سبد خرید</span>
            <span className="inline-flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              <span className="h-2.5 w-2.5 rounded-full bg-primary" />
            </span>
          </Link>

          {/* حساب کاربری در موبایل */}
          {!isLoggedIn ? (
            <Link
              href="/auth/login"
              onClick={onClose}
              className="flex items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-muted"
            >
              <span className="font-semibold">ورود / ثبت‌نام</span>
              <User className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <div className="flex items-center justify-between rounded-lg px-3 py-2 text-sm">
                <span className="font-semibold">{fullName ?? "کاربر"}</span>
                <User className="w-4 h-4" />
              </div>
              <Link
                href="/user/dashboard"
                onClick={onClose}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-muted"
              >
                <span className="font-semibold">پنل من</span>
              </Link>
              <button
                onClick={() => {
                  onSignOut();
                  onClose();
                }}
                className="w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-muted"
              >
                <span className="font-semibold">خروج</span>
                <LogOut className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

/* ---------- Navbar ---------- */
export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  // نام و وضعیت ورود را مستقیم از Redux بگیر
  const fullName = useAppSelector((s) => s.user.profile?.fullName ?? null);
  const isLoggedIn = useAppSelector((s) => Boolean(s.user.profile));

  const supabase = createSupabaseClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  const [open, setOpen] = useState<boolean>(false);
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center gap-4">
            {/* Logo (right) */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <Image src="/favicon.ico" alt="لوگو" width={32} height={32} />
              <span className="text-xl font-extrabold text-primary">
                گل‌فروش
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-6 mx-auto">
              <Link
                href="/"
                className={clsx(
                  "text-sm font-semibold hover:text-primary transition-colors",
                  isActive("/") ? "text-primary" : "text-text",
                )}
              >
                صفحه اصلی
              </Link>

              {/* Products dropdown */}
              <div className="relative group/menu">
                <Button
                  variant="ghost"
                  type="button"
                  className="flex items-center gap-1 text-sm font-semibold hover:text-primary transition-colors"
                >
                  محصولات
                  <ChevronDown className="w-4 h-4" />
                </Button>

                <div
                  className="
                    absolute right-0 top-full z-50 pt-2
                    opacity-0 invisible pointer-events-none translate-y-2
                    transition duration-150
                    group-hover/menu:opacity-100 group-hover/menu:visible group-hover/menu:pointer-events-auto group-hover/menu:translate-y-0
                  "
                >
                  <div className="w-56 rounded-xl border border-border bg-surface shadow-lg p-2">
                    {CATEGORIES.map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        className="block rounded-lg px-3 py-2 text-sm hover:bg-muted hover:text-primary transition-colors"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {NAV.slice(1).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "text-sm font-semibold hover:text-primary transition-colors",
                    isActive(item.href) ? "text-primary" : "text-text",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Actions (left) */}
            <div className="ms-auto items-center gap-3 hidden lg:flex">
              <Button
                variant="ghost"
                className="p-2 rounded-full hover:bg-muted"
                aria-label="جستجو"
              >
                <Search className="w-5 h-5" />
              </Button>
              <Link
                href="/wishlist"
                className="p-2 rounded-full hover:bg-muted"
                aria-label="علاقه‌مندی"
              >
                <Heart className="w-5 h-5" />
              </Link>
              <Link
                href="/cart"
                className="relative p-2 rounded-full hover:bg-muted"
                aria-label="سبد خرید"
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute -top-0.5 -left-0.5 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-surface" />
              </Link>

              {/* ورود / حساب + خروج */}
              {!isLoggedIn ? (
                <Link
                  href="/auth/login"
                  className="p-2 rounded-full hover:bg-muted"
                  aria-label="ورود"
                >
                  <User className="w-5 h-5" />
                </Link>
              ) : (
                <div className="relative group">
                  <button
                    className="p-2 rounded-full hover:bg-muted"
                    aria-label="حساب"
                    title={fullName ?? "کاربر"}
                  >
                    <User className="w-5 h-5" />
                  </button>
                  <div
                    className="
                      absolute left-0 top-full mt-2 w-48 rounded-xl border border-border bg-surface shadow-lg p-2
                      invisible opacity-0 translate-y-1 transition
                      group-hover:visible group-hover:opacity-100 group-hover:translate-y-0
                    "
                  >
                    <div className="px-3 py-2 text-xs text-muted-foreground">
                      {fullName ?? "کاربر"}
                    </div>
                    <Link
                      href="/user/dashboard"
                      className="block rounded-lg px-3 py-2 text-sm hover:bg-muted"
                    >
                      پنل من
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-right rounded-lg px-3 py-2 text-sm hover:bg-muted flex items-center justify-between"
                    >
                      خروج
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Hamburger (mobile) */}
            <div className="ms-auto items-center gap-3 lg:hidden">
              <Button
                className="p-2 rounded-full hover:bg-muted"
                onClick={() => setOpen(true)}
                aria-label="باز کردن منو"
              >
                <Menu className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        open={open}
        onClose={() => setOpen(false)}
        isActive={isActive}
        isLoggedIn={isLoggedIn}
        fullName={fullName}
        onSignOut={handleSignOut}
      />
    </>
  );
}
