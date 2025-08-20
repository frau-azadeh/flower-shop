"use client";

import React, { useMemo, useState } from "react";
import Tabs, { TabItem } from "../ui/Tabs";
import { Clock, PackageCheck, Search, Undo2, XCircle } from "lucide-react";
import Input from "../ui/Input";
import AutoCheckout from "./AutoCheckout";
import { useOrders } from "./useOrders";
import { useSearchParams } from "next/navigation";

const baseTabs: TabItem[] = [
  {
    key: "current",
    label: "جاری",
    icon: <Clock className="size-4" />,
    emptyIcon: <Clock className="size-24 text-slate-300" />,
    emptyText: "سفارشی در حال انجام ندارید",
    badgeCount: 0,
  },
  {
    key: "delivered",
    label: "تحویل شده",
    icon: <PackageCheck className="size-4" />,
    emptyIcon: <PackageCheck className="size-24 text-slate-300" />,
    emptyText: "سفارش تحویل شده ای وجود ندارد",
    badgeCount: 0,
  },
  {
    key: "returned",
    label: "مرجوع شده",
    icon: <Undo2 className="size-4" />,
    emptyIcon: <Undo2 className="size-24 text-slate-300" />,
    emptyText: "مورد مرجوع شده ای ندارید",
    badgeCount: 0,
  },
  {
    key: "canceled",
    label: "لغو شده",
    icon: <XCircle className="size-4" />,
    emptyIcon: <XCircle className="size-24 text-slate-300" />,
    emptyText: "سفارشی لغو نشده است",
    badgeCount: 0,
  },
];

export default function OrderHistory() {
  const [query, setQuery] = useState("");
  const params = useSearchParams();

  const { loading, groups, counts } = useOrders();

  const tabs = useMemo<TabItem[]>(
    () =>
      baseTabs.map((t) => ({
        ...t,
        badgeCount: counts[t.key as keyof typeof counts] ?? 0,
      })),
    [counts],
  );

  // تب فعال از پارامتر URL (هماهنگ با Tabs شما)
  const activeKey = (params.get("status") ?? "current") as keyof typeof groups;
  const visible = groups[activeKey] ?? [];

  const filtered = useMemo(
    () =>
      visible.filter((o) =>
        [o.id, o.fullName, o.phone, o.address].some((f) =>
          String(f ?? "")
            .toLowerCase()
            .includes(query.toLowerCase()),
        ),
      ),
    [visible, query],
  );

  return (
    <section dir="rtl" className="mx-auto max-w-6xl p-4 md:p-6">
      {/* اجرای نامرئی اتوچک‌اوت در صورت ?checkout=1 */}
      <AutoCheckout />

      <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6 text-right">
        <div className="mb-5 flex flex-col-reverse gap-4 md:mb-6 md:flex-row md:items-center md:justify-between">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800">
            تاریخچه سفارشات
          </h2>
          <label className="relative w-full md:w-72">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجو"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-4 pl-10 text-sm outline-none transition focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
            <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-slate-500" />
          </label>
        </div>

        <Tabs tabs={tabs} paramsName="status" />

        {/* نمایش لیست در همان باکس، بدون تغییر دیزاین تب‌ها */}
        {filtered.length > 0 && (
          <div className="mt-4 grid gap-3">
            {filtered.map((o) => (
              <div key={o.id} className="border rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">کد سفارش: {o.id}</div>
                  <span className="text-xs rounded-full border px-2 py-0.5">
                    {o.status}
                  </span>
                </div>
                <div className="mt-2 text-sm text-slate-700">
                  <div>نام: {o.fullName}</div>
                  <div>تلفن: {o.phone}</div>
                  <div>آدرس: {o.address}</div>
                  {o.note && <div>توضیح: {o.note}</div>}
                  <div className="mt-1 font-medium">
                    مبلغ: {o.grandTotal.toLocaleString()} تومان
                  </div>
                  <div className="text-slate-500">
                    {new Date(o.createdAt).toLocaleString("fa-IR")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* اگر filtered خالی باشد، همان Empty داخلی Tabs دیده می‌شود */}
        {!loading && filtered.length === 0 && <div className="mt-4" />}
      </div>
    </section>
  );
}
