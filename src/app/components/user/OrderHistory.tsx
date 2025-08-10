// app/components/user/OrderHistoryCard.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { Search, FileText, Clock, PackageCheck, Undo2, XCircle } from "lucide-react";

type Status = "current" | "delivered" | "returned" | "canceled";

const TABS: { key: Status; label: string }[] = [
  { key: "current", label: "جاری" },
  { key: "delivered", label: "تحویل شده" },
  { key: "returned", label: "مرجوع شده" },
  { key: "canceled", label: "لغو شده" },
];

// آیکن + متن مخصوص هر تب
const CONTENT: Record<Status, { icon: ReactNode; text: string }> = {
  current:   { icon: <Clock className="size-24 md:size-28 text-slate-300" />,      text: "سفارشی در حال انجام ندارید." },
  delivered: { icon: <PackageCheck className="size-24 md:size-28 text-slate-300" />, text: "سفارش تحویل‌شده‌ای وجود ندارد." },
  returned:  { icon: <Undo2 className="size-24 md:size-28 text-slate-300" />,      text: "مورد مرجوع‌شده‌ای ندارید." },
  canceled:  { icon: <XCircle className="size-24 md:size-28 text-slate-300" />,     text: "سفارشی لغو نشده است." },
};

export default function OrderHistory() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [q, setQ] = useState("");

  // تب فعال از روی querystring
  const KEYS: Status[] = ["current", "delivered", "returned", "canceled"];
  const current = ((): Status => {
    const s = searchParams.get("status") as Status | null;
    return s && KEYS.includes(s) ? s : "current";
  })();

  // اگر hash قدیمی بود (#returned)، به ?status=... تبدیلش کن
  useEffect(() => {
    const h = window.location.hash.replace("#", "");
    if (h && KEYS.includes(h as Status)) {
      const sp = new URLSearchParams(searchParams.toString());
      sp.set("status", h);
      router.replace(`${pathname}?${sp.toString()}`, { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const makeHref = (s: Status) => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("status", s);
    return `${pathname}?${sp.toString()}`;
  };

  const { icon, text } = CONTENT[current];

  return (
    <div className="mx-auto max-w-6xl px-3 md:px-4" dir="rtl">
      <section className="rounded-3xl border border-slate-200 bg-white shadow-sm md:shadow p-4 md:p-6 text-right">
        {/* Header */}
        <div className="mb-5 flex flex-col-reverse items-start gap-4 md:mb-6 md:flex-row md:items-center md:justify-between">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800">تاریخچه سفارشات</h2>

          {/* Search */}
          <label className="relative w-full md:w-72">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="جستجو"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-4 pl-10 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent"
            />
            <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-slate-500" />
          </label>
        </div>

        {/* Tabs (لینک پویا ?status=...) */}
        <div className="mb-2 flex flex-wrap items-center gap-2 text-sm" role="tablist" aria-label="فیلتر وضعیت سفارش">
          {TABS.map((t) => {
            const active = t.key === current;
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
                <span>{t.label}</span>
                <span
                  className={`mr-2 inline-block rounded-md px-1.5 py-0.5 text-[11px] leading-none ${
                    active ? "bg-background text-accent" : "bg-slate-200 text-slate-700"
                  }`}
                >
                  0
                </span>
                {active && <span className="absolute -bottom-2 left-1/2 h-[3px] w-12 -translate-x-1/2 rounded-full bg-accent" />}
              </Link>
            );
          })}
        </div>

        <div className="mb-6 border-b border-slate-200" />

        {/* Empty State بر اساس تب */}
        <div className="flex flex-col items-center justify-center py-16 md:py-20 text-center">
          {icon ?? <FileText className="size-24 md:size-28 text-slate-300" />}
          <p className="mt-5 text-[15px] md:text-base font-medium text-slate-700">{text}</p>
        </div>
      </section>
    </div>
  );
}
