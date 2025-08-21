"use client";

import { usePathname, useSearchParams } from "next/navigation";
import React, { ReactNode } from "react";
import Link from "next/link";

export type TabItem = {
  key: string;
  label: string;
  icon?: ReactNode;
  header?: ReactNode;
  emptyIcon?: ReactNode;
  emptyText?: string;
  badgeCount?: number;
};

interface TabsProps {
  tabs: TabItem[];
  paramsName?: string;
  /** اگر true باشد پیام/آیکن «خالی» نمایش داده می‌شود (پیش‌فرض: true) */
  showEmpty?: boolean;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  paramsName = "status",
  showEmpty = true,
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const current = searchParams.get(paramsName) || tabs[0]?.key || "";

  const makeHref = (key: string) => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set(paramsName, key);
    return `${pathname}?${sp.toString()}`;
  };

  const activeTab = tabs.find((t) => t.key === current) ?? tabs[0];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6">
      {/* ناوبری تب‌ها */}
      <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
        {tabs.map((t) => {
          const active = current === t.key;
          return (
            <Link
              key={t.key}
              href={makeHref(t.key)}
              replace
              scroll={false}
              className={`relative rounded-full px-3.5 py-1.5 transition ${
                active ? "text-accent" : "text-slate-600 hover:text-slate-800"
              }`}
            >
              {t.icon}
              <span className="mr-1">{t.label}</span>

              {typeof t.badgeCount === "number" && (
                <span
                  className={`mr-2 inline-block rounded-md px-1.5 py-0.5 text-[11px] leading-none ${
                    active
                      ? "bg-background text-accent"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {t.badgeCount}
                </span>
              )}

              {active && (
                <span className="absolute -bottom-2 left-1/2 h-[3px] w-10 -translate-x-1/2 rounded-full bg-accent" />
              )}
            </Link>
          );
        })}
      </div>

      {/* محتوای اختصاصی تب (اختیاری) */}
      {activeTab?.header}

      {/* پیام خالی فقط اگر والد اجازه دهد */}
      {showEmpty && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          {activeTab?.emptyIcon}
          <p className="mt-6 text-sm md:text-base text-slate-700">
            {activeTab?.emptyText}
          </p>
        </div>
      )}
    </section>
  );
};

export default Tabs;
