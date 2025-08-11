"use client";

import { useState } from "react";
import Tabs, { TabItem } from "@/app/components/ui/Tabs";
import { Search, Clock, PackageCheck, Undo2, XCircle } from "lucide-react";
import Input from "../ui/Input";

export default function OrderHistory() {
  const [q, setQ] = useState("");

  const tabs: TabItem[] = [
    {
      key: "current",
      label: "جاری",
      emptyIcon: <Clock className="size-24 md:size-28 text-slate-300" />,
      emptyText: "سفارشی در حال انجام ندارید.",
      badgeCount: 0,
    },
    {
      key: "delivered",
      label: "تحویل شده",
      emptyIcon: <PackageCheck className="size-24 md:size-28 text-slate-300" />,
      emptyText: "سفارش تحویل‌شده‌ای وجود ندارد.",
      badgeCount: 0,
    },
    {
      key: "returned",
      label: "مرجوع شده",
      emptyIcon: <Undo2 className="size-24 md:size-28 text-slate-300" />,
      emptyText: "مورد مرجوع‌شده‌ای ندارید.",
      badgeCount: 0,
    },
    {
      key: "canceled",
      label: "لغو شده",
      emptyIcon: <XCircle className="size-24 md:size-28 text-slate-300" />,
      emptyText: "سفارشی لغو نشده است.",
      badgeCount: 0,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-3 md:px-4" dir="rtl">
      <section className="rounded-3xl border border-slate-200 bg-white shadow-sm md:shadow p-4 md:p-6 text-right">
        {/* Header */}
        <div className="mb-5 flex flex-col-reverse items-start gap-4 md:mb-6 md:flex-row md:items-center md:justify-between">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800">
            تاریخچه سفارشات
          </h2>

          {/* Search */}
          <label className="relative w-full md:w-72">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="جستجو"
            />
            <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-slate-500" />
          </label>
        </div>

        {/* Tabs */}
        <Tabs tabs={tabs} paramName="status" />
      </section>
    </div>
  );
}
