"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { toman } from "@/lib/format";

type Props = {
  count: number;
  total: number;
  onCheckout: () => void;
};

export default function CartSummary({ count, total, onCheckout }: Props) {
  return (
    <aside className="md:sticky md:top-24 h-max">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ring-1 ring-black/5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">تعداد اقلام</span>
          <span className="font-semibold">{count}</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="text-slate-600">جمع کل</span>
          <span className="text-base font-extrabold">
            {toman(total)}{" "}
            <span className="text-xs font-normal text-slate-500">تومان</span>
          </span>
        </div>

        <button
          onClick={onCheckout}
          className="mt-4 w-full rounded-xl bg-black px-4 py-3 text-sm font-medium text-white hover:opacity-90"
        >
          ادامه و ثبت نهایی
        </button>

        <Link
          href="/products"
          className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft className="size-4" />
          ادامه خرید
        </Link>
      </div>
    </aside>
  );
}
