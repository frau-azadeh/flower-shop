"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { Search, Heart, ShoppingBag, User2Icon } from "lucide-react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function MobileNavBar() {
  const pathname = usePathname();

  // جمع کل تعداد آیتم‌های سبد از Redux
  const totalQty = useSelector((s: RootState) =>
    Object.values(s.cart.items).reduce((sum, it) => sum + it.qty, 0),
  );

  const itemCls = "flex flex-col items-center text-white relative";
  const isActive = (p: string) => pathname?.startsWith(p);

  return (
    <div className="fixed bottom-0 w-full bg-primary shadow-lg flex justify-around items-center py-2 z-50 md:hidden rounded-t-md">
      <Link
        href="/search"
        className={clsx(itemCls, isActive("/search") && "opacity-90")}
        aria-label="جستجو"
      >
        <Search size={24} />
      </Link>

      <Link
        href="/favorites"
        className={clsx(itemCls, isActive("/favorites") && "opacity-90")}
        aria-label="علاقه‌مندی‌ها"
      >
        <Heart size={24} />
      </Link>

      <Link
        href="/cart"
        className={clsx(itemCls, isActive("/cart") && "opacity-90")}
        aria-label="سبد خرید"
      >
        <ShoppingBag size={24} />
        {totalQty > 0 && (
          <span className="absolute -top-1 -right-2 rounded-full bg-black text-white text-xs px-1.5 py-0.5">
            {totalQty}
          </span>
        )}
      </Link>

      <Link
        href="/user/dashboard"
        className={clsx(itemCls, isActive("/user") && "opacity-90")}
        aria-label="پنل کاربر"
      >
        <User2Icon size={24} />
      </Link>
    </div>
  );
}
