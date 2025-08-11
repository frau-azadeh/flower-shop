// app/components/admin/OrdersCard.tsx
"use client";

import { useState } from "react";
import Tabs, { TabItem } from "@/app/components/ui/Tabs";
import {
  Search,
  Flower2,   // all
  Clock,       // pending
  Loader2,     // processing
  PackageCheck,// delivered
  XCircle,     // canceled
  Undo2,       // returned
} from "lucide-react";

export default function OrdersCard() {
  const [q, setQ] = useState("");

  const tabs: TabItem[] = [
    {
      key: "all",
      label: "همه",
      emptyIcon: <Flower2 className="size-24 text-slate-300" />,
      emptyText: "هنوز سفارشی ثبت نشده است.",
      badgeCount: 0,
    },
    {
      key: "pending",
      label: "در انتظار",
      emptyIcon: <Clock className="size-24 text-slate-300" />,
      emptyText: "سفارش در انتظاری وجود ندارد.",
      badgeCount: 0,
    },
    {
      key: "processing",
      label: "در حال پردازش",
      emptyIcon: <Loader2 className="size-24 text-slate-300" />,
      emptyText: "سفارشی در حال پردازش نیست.",
      badgeCount: 0,
    },
    {
      key: "delivered",
      label: "تحویل شده",
      emptyIcon: <PackageCheck className="size-24 text-slate-300" />,
      emptyText: "سفارش تحویل‌شده‌ای یافت نشد.",
      badgeCount: 0,
    },
    {
      key: "canceled",
      label: "لغو شده",
      emptyIcon: <XCircle className="size-24 text-slate-300" />,
      emptyText: "سفارشی لغو نشده است.",
      badgeCount: 0,
    },
    {
      key: "returned",
      label: "مرجوعی",
      emptyIcon: <Undo2 className="size-24 text-slate-300" />,
      emptyText: "مرجوعی ثبت نشده است.",
      badgeCount: 0,
    },
  ];

  return (
    <section dir="rtl" className="mx-auto max-w-6xl p-4 md:p-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6 text-right">
        {/* Header */}
        <div className="mb-5 flex flex-col-reverse gap-4 md:mb-6 md:flex-row md:items-center md:justify-between">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800">سفارشات</h2>

          <label className="relative w-full md:w-72">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="جستجو (شماره یا نام مشتری)"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-4 pl-10 text-sm outline-none transition focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-500" />
          </label>
        </div>

        {/* Tabs: از ?status= برای تب فعال استفاده می‌کند */}
        <Tabs tabs={tabs} paramName="status" />
      </div>
    </section>
  );
}
