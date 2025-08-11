"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ReactNode } from "react";

export type TabItem = {
  key: string;
  label: string;
  icon: ReactNode;
  header?: ReactNode;
  emptyIcon?: ReactNode;
  emptyText?: string;
};

interface TabsProps {
  tabs: TabItem[];
  paramName?: string; // اسم پارامتر در URL - پیش‌فرض activeTab
}

export default function Tabs({ tabs, paramName = "activeTab" }: TabsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const current = searchParams.get(paramName) || tabs[0].key;

  const makeHref = (key: string) => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set(paramName, key);
    return `${pathname}?${sp.toString()}`;
  };

  const activeTab = tabs.find((t) => t.key === current) || tabs[0];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6">
      {/* ناوبری تب‌ها */}
      <div className="mb-3 flex gap-2 text-sm">
        {tabs.map((t) => {
          const active = current === t.key;
          return (
            <Link
              key={t.key}
              href={makeHref(t.key)}
              replace
              scroll={false}
              className={`relative rounded-full px-3 py-1.5 ${
                active ? "text-accent" : "text-slate-600 hover:text-slate-800"
              }`}
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

      {/* محتوای تب فعال */}
      {activeTab.header}
      <div className="flex flex-col items-center justify-center py-16 text-center">
        {activeTab.emptyIcon}
        <p className="mt-6 text-sm md:text-base text-slate-700">
          {activeTab.emptyText}
        </p>
      </div>
    </section>
  );
}
