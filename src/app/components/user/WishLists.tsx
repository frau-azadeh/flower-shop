// app/components/user/Wishlists.tsx
"use client";

import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { Bell, Heart, List, Info, ToggleRight } from "lucide-react";

type Tab = "favorites" | "others" | "alerts";

const TABS: { key: Tab; label: string; icon: ReactNode }[] = [
  {
    key: "favorites",
    label: "لیست علاقه‌مندی",
    icon: <Heart className="size-4" />,
  },
  { key: "others", label: "لیست‌های دیگر", icon: <List className="size-4" /> },
  { key: "alerts", label: "اطلاع‌رسانی‌ها", icon: <Info className="size-4" /> },
];

export default function Wishlists() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // اگر قبلاً از #alerts استفاده می‌کردی، این اثر اختیاری hash رو به query تبدیل می‌کنه
  useEffect(() => {
    const h = window.location.hash.replace("#", "");
    if (h && ["favorites", "others", "alerts"].includes(h)) {
      const sp = new URLSearchParams(searchParams.toString());
      sp.set("activeTab", h);
      router.replace(`${pathname}?${sp.toString()}`, { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const current = (() => {
    const t = (searchParams.get("activeTab") ?? "favorites") as Tab;
    return (["favorites", "others", "alerts"] as const).includes(t)
      ? t
      : "favorites";
  })();

  // برای حفظ سایر پارامترها
  const makeHref = (t: Tab) => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("activeTab", t);
    return `${pathname}?${sp.toString()}`;
  };

  const showAlertsUI = current === "alerts";

  return (
    <section
      dir="rtl"
      className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6 text-right"
    >
      {/* Tabs با لینک پویا ?activeTab=... */}
      <div className="mb-3 flex gap-2 text-sm">
        {TABS.map((t) => {
          const active = current === t.key;
          return (
            <Link
              key={t.key}
              href={makeHref(t.key)}
              replace
              scroll={false}
              className={`relative rounded-full px-3.5 py-1.5
                ${active ? "text-accent" : "text-slate-600 hover:text-slate-800"}`}
            >
              {t.icon}
              <span>{t.label}</span>
              {active && (
                <span className="h-[3px] w-10 -mb-2 block rounded-full bg-accent self-end" />
              )}
            </Link>
          );
        })}
      </div>

      <hr className="mb-4 border-slate-200" />

      {/* هدر و تاگل فقط برای تب alerts */}
      {showAlertsUI && (
        <>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="size-5" />
              <h3 className="font-semibold">اطلاع‌رسانی‌ها</h3>
            </div>
            <button className="flex items-center rounded-full px-2 py-1 text-primary">
              {/* نمایش استاتیک — بعداً می‌تونی state بدی */}
              <ToggleRight className="size-8" />
            </button>
          </div>
          <p className="mb-3 text-xs text-slate-500">
            اطلاع‌رسانی تخفیف و موجودی این کالاها
          </p>
          <hr className="mb-8 border-slate-200" />
        </>
      )}

      {/* Empty state مخصوص هر تب */}
      <div className="flex flex-col items-center justify-center py-16 text-center">
        {current === "favorites" && (
          <Heart className="size-24 text-slate-300" />
        )}
        {current === "others" && <List className="size-24 text-slate-300" />}
        {current === "alerts" && <Bell className="size-24 text-slate-300" />}
        <p className="mt-6 text-sm md:text-base text-slate-700">
          {current === "favorites" && "لیست علاقه‌مندی‌های شما خالی است."}
          {current === "others" && "هنوز لیست دیگری ایجاد نکرده‌اید."}
          {current === "alerts" && "هنوز هیچ اعلان فعالی ندارید."}
        </p>
      </div>
    </section>
  );
}
