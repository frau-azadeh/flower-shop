"use client";

import { useState } from "react";
import {
  Minus,
  Plus,
  ShoppingCart,
  Truck,
  ShieldCheck,
  Headphones,
} from "lucide-react";

type Props = {
  productId: string;
  productName: string;
  price: number;
  onAdd?: (info: { productId: string; qty: number }) => void;
};

export default function BuyBar({ productId, productName, price, onAdd }: Props) {
  const [qty, setQty] = useState(1);

  const dec = () => setQty((q) => Math.max(1, q - 1));
  const inc = () => setQty((q) => Math.min(99, q + 1));

  const add = () => {
    onAdd?.({ productId, qty });
    // اینجا اگر سبد خرید داری، کالش رو صدا بزن
  };

  return (
    <div className="space-y-4" dir="rtl">
      {/* کنترل تعداد + دکمه خرید (سبز) */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* کنترل تعداد */}
        <div className="inline-flex items-center justify-between rounded-xl border border-emerald-200 bg-white px-2 py-1 shadow-sm sm:order-2">
          <button
            type="button"
            onClick={inc}
            className="grid size-9 place-items-center rounded-lg text-emerald-700 hover:bg-emerald-50"
            aria-label="افزایش"
          >
            <Plus className="size-4" />
          </button>
          <span className="mx-3 min-w-[2.5rem] text-center font-bold text-slate-800">
            {qty}
          </span>
          <button
            type="button"
            onClick={dec}
            className="grid size-9 place-items-center rounded-lg text-emerald-700 hover:bg-emerald-50"
            aria-label="کاهش"
          >
            <Minus className="size-4" />
          </button>
        </div>

        {/* دکمه خرید سبز */}
        <button
          type="button"
          onClick={add}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white shadow-lg shadow-emerald-600/25 transition-colors hover:bg-emerald-700 sm:order-1"
        >
          <ShoppingCart className="size-5" />
          افزودن به سبد
        </button>
      </div>

      {/* مزایا */}
      <ul className="flex flex-wrap gap-2 text-[13px]">
        <li className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-1.5 text-emerald-800 ring-1 ring-emerald-200">
          <Truck className="size-4" />
          ارسال رایگان
        </li>
        <li className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-1.5 text-emerald-800 ring-1 ring-emerald-200">
          <ShieldCheck className="size-4" />
          ضمانت کیفیت
        </li>
        <li className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-1.5 text-emerald-800 ring-1 ring-emerald-200">
          <Headphones className="size-4" />
          پشتیبانی ۲۴/۷
        </li>
      </ul>
    </div>
  );
}
