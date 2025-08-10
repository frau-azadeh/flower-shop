// app/components/admin/OrdersCard.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ReactNode, useState } from "react";
import {
  Search,
  Flower2, // برای "همه"
  Clock, // pending
  Loader2, // processing
  PackageCheck, // delivered
  XCircle, // canceled
  Undo2, // returned
} from "lucide-react";

type OrderStatus =
  | "pending"
  | "processing"
  | "delivered"
  | "canceled"
  | "returned";
type StatusTab = OrderStatus | "all";

const TABS: { key: StatusTab; label: string }[] = [
  { key: "all", label: "همه" },
  { key: "pending", label: "در انتظار" },
  { key: "processing", label: "در حال پردازش" },
  { key: "delivered", label: "تحویل شده" },
  { key: "canceled", label: "لغو شده" },
  { key: "returned", label: "مرجوعی" },
];

// آیکن + متن مخصوص هر تب (برای حالت بدون داده)
const CONTENT: Record<StatusTab, { icon: ReactNode; text: string }> = {
  all: {
    icon: <Flower2 className="size-24 text-slate-300" />,
    text: "هنوز سفارشی ثبت نشده است.",
  },
  pending: {
    icon: <Clock className="size-24 text-slate-300" />,
    text: "سفارش در انتظاری وجود ندارد.",
  },
  processing: {
    icon: <Loader2 className="size-24 text-slate-300" />,
    text: "سفارشی در حال پردازش نیست.",
  },
  delivered: {
    icon: <PackageCheck className="size-24 text-slate-300" />,
    text: "سفارش تحویل‌شده‌ای یافت نشد.",
  },
  canceled: {
    icon: <XCircle className="size-24 text-slate-300" />,
    text: "سفارشی لغو نشده است.",
  },
  returned: {
    icon: <Undo2 className="size-24 text-slate-300" />,
    text: "مرجوعی ثبت نشده است.",
  },
};

export default function OrdersCard() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // وضعیت فعلی از URL
  const STATUSES: StatusTab[] = [
    "all",
    "pending",
    "processing",
    "delivered",
    "canceled",
    "returned",
  ];
  const s = (searchParams.get("status") ?? "all") as StatusTab;
  const current: StatusTab = STATUSES.includes(s) ? s : "all";

  // ساخت لینک هر تب با حفظ سایر پارامترها
  const makeHref = (status: StatusTab) => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("status", status);
    return `${pathname}?${sp.toString()}`;
  };

  // فقط برای UI سرچ (دینامیکش نکردم چون گفتی فقط UI)
  const [q, setQ] = useState("");

  const { icon, text } = CONTENT[current];

  return (
    <section dir="rtl" className="mx-auto max-w-6xl p-4 md:p-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6 text-right">
        {/* Header */}
        <div className="mb-5 flex flex-col-reverse gap-4 md:mb-6 md:flex-row md:items-center md:justify-between">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800">
            سفارشات
          </h2>
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

        {/* Tabs (داینامیک با ?status=...) */}
        <div
          className="mb-3 flex flex-wrap items-center gap-2 text-sm"
          role="tablist"
          aria-label="وضعیت سفارش"
        >
          {TABS.map((t) => {
            const active = current === t.key;
            return (
              <Link
                key={t.key}
                href={makeHref(t.key)}
                replace
                scroll={false}
                role="tab"
                aria-selected={active}
                className={`relative rounded-full px-3.5 py-1.5 transition ${
                  active ? "text-accent" : "text-slate-600 hover:text-slate-800"
                }`}
              >
                {t.label}
                <span
                  className={`mr-2 inline-block rounded-md px-1.5 py-0.5 text-[11px] leading-none ${
                    active
                      ? "bg-background text-accent"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  0
                </span>
                {active && (
                  <span className="absolute -bottom-2 left-1/2 h-[3px] w-12 -translate-x-1/2 rounded-full bg-accent" />
                )}
              </Link>
            );
          })}
        </div>

        <div className="mb-4 border-b border-slate-200" />

        {/* Empty state: آیکن و متن بر اساس تب فعال */}
        <div className="flex flex-col items-center justify-center py-16 text-center">
          {icon}
          <p className="mt-5 text-[15px] md:text-base font-medium text-slate-700">
            {text}
          </p>
        </div>
      </div>
    </section>
  );
}
