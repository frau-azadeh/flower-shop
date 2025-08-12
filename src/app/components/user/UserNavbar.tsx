"use client";
import { createSupabaseClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Bell,
  Handbag,
  Heart,
  LogOut,
  MapPin,
  Menu,
  MessageCircle,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import Button from "../ui/Button";

const UserNavbar = () => {
  const supabase = createSupabaseClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };
  const [open, setOpen] = useState(false);

  const item =
    "block rounded-lg px-3 py-2 text-sm hover:bg-muted hover:text-primary";

  return (
    <>
      {/* سایدبار دسکتاپ */}
      <aside className="hidden md:block border-l border-border bg-surface p-4 sticky top-0 h-screen w-[240px] ">
        <div className="text-lg font-extrabold text-primary mb-3">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-xl font-extrabold text-primary">
              خلاصه وضعیت
            </span>
          </Link>
        </div>
        <nav className="space-y-2 text-sm ">
          <a
            href="/user/dashboard"
            className={`${item} flex items-center gap-2`}
          >
            <Handbag className="w-4 h-4" />
            سفارش ها
          </a>
          <a href="/user/list" className={`${item} flex items-center gap-2`}>
            <Heart className="w-4 h-4" />
            لسیت های من
          </a>
          <a href="/user/answer" className={`${item} flex items-center gap-2`}>
            <MessageCircle className="w-4 h-4" />
            دیدگاه و پرسش
          </a>
          <a href="/user/address" className={`${item} flex items-center gap-2`}>
            <MapPin className="w-4 h-4" />
            آدرس ها
          </a>
          <a href="/user/message" className={`${item} flex items-center gap-2`}>
            <Bell className="w-4 h-4" />
            پیام ها
          </a>
          <a
            href="/user/information"
            className={`${item} flex items-center gap-2`}
          >
            <User className="w-4 h-4" />
            اطلاعات حساب
          </a>

          <Button
            variant="ghost"
            onClick={handleLogout}
            icon={<LogOut className="w-4 h-4 " />}
          >
            خروج از حساب
          </Button>
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
          <span className="text-xl font-extrabold text-primary">
            خلاصه وضعیت
          </span>
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
          <div className="text-lg font-extrabold text-primary">خلاصه وضعیت</div>
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
            href="/user/dashboard"
            className={`${item} flex items-center gap-2`}
            onClick={() => setOpen(false)}
          >
            <Handbag className="w-4 h-4" />
            سفارش ها
          </a>
          <a
            href="/user/list"
            className={`${item} flex items-center gap-2`}
            onClick={() => setOpen(false)}
          >
            <Heart className="w-4 h-4" />
            لسیت های من
          </a>
          <a
            href="/user/answer"
            className={`${item} flex items-center gap-2`}
            onClick={() => setOpen(false)}
          >
            <MessageCircle className="w-4 h-4" />
            دیدگاه و پرسش
          </a>
          <a
            href="/user/address"
            className={`${item} flex items-center gap-2`}
            onClick={() => setOpen(false)}
          >
            <MapPin className="w-4 h-4" />
            آدرس ها
          </a>

          <a
            href="/user/message"
            className={`${item} flex items-center gap-2`}
            onClick={() => setOpen(false)}
          >
            <Bell className="w-4 h-4" />
            پیام ها
          </a>
          <a
            href="/user/information"
            className={`${item} flex items-center gap-2`}
            onClick={() => setOpen(false)}
          >
            <User className="w-4 h-4" />
            اطلاعات حساب
          </a>

          <Button
            variant="ghost"
            onClick={handleLogout}
            icon={<LogOut className="w-4 h-4 flex items-center gap-2" />}
          >
            خروج از حساب
          </Button>
        </nav>
      </aside>
    </>
  );
};
export default UserNavbar;
