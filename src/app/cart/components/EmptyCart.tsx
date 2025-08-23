"use client";

import Link from "next/link";
import { ShoppingCart, ArrowLeft } from "lucide-react";

export default function EmptyCart() {
  return (
    <main dir="rtl" className="mx-auto max-w-4xl px-4 py-10">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <ShoppingCart className="mx-auto size-12 text-slate-300" />
        <h1 className="mt-4 text-lg font-bold">سبد شما خالی است</h1>
        <p className="mt-2 text-sm text-slate-600">
          هنوز محصولی به سبد اضافه نکرده‌اید.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm hover:bg-slate-50"
        >
          <ArrowLeft className="size-4" />
          رفتن به محصولات
        </Link>
      </div>
    </main>
  );
}
