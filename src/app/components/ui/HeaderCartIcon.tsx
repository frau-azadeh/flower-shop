"use client";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { selectCartTotalQty } from "@/store/selectors";

export default function HeaderCartIcon({
  className = "",
}: {
  className?: string;
}) {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const totalQty = useAppSelector(selectCartTotalQty);

  return (
    <Link
      href="/cart"
      className={`relative p-2 rounded-full hover:bg-muted ${className}`}
      aria-label="سبد خرید"
    >
      <ShoppingBag className="w-5 h-5" />
      {hydrated && totalQty > 0 && (
        <span className="absolute -top-1 -left-1 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-white text-[11px] leading-[18px] text-center ring-2 ring-surface">
          {totalQty}
        </span>
      )}
    </Link>
  );
}
