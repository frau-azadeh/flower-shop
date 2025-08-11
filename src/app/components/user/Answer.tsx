// app/components/user/Answer.tsx
"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ReactNode } from "react";
import {
  FileText,
  MessageCircleHeart,
  MessageCircleWarning,
  MessageSquare,
} from "lucide-react";

type Tab = "waiting" | "opinion" | "question";

const TABS: { key: Tab; label: string; icon: ReactNode }[] = [
  {
    key: "waiting",
    label: "در انتظار دیدگاه",
    icon: <MessageCircleWarning className="size-4" />,
  },
  {
    key: "opinion",
    label: "دیدگاه من",
    icon: <MessageCircleHeart className="size-4" />,
  },
  {
    key: "question",
    label: "پرسش و پاسخ",
    icon: <MessageSquare className="size-4" />,
  },
];

// آیکن و متن مخصوص هر تب
const CONTENT: Record<Tab, { text: string; icon: ReactNode }> = {
  waiting: {
    text: "هیچ موردی در انتظار بررسی نیست.",
    icon: <MessageCircleWarning className="size-24 text-slate-300" />,
  },
  opinion: {
    text: "هنوز دیدگاهی ثبت نکرده‌اید.",
    icon: <MessageCircleHeart className="size-24 text-slate-300" />,
  },
  question: {
    text: "لیست سوال‌های شما خالی است.",
    icon: <MessageSquare className="size-24 text-slate-300" />,
  },
};

export default function Answer() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const KEYS: Tab[] = ["waiting", "opinion", "question"];
  const current: Tab = (() => {
    const t = searchParams.get("activeTab") as Tab | null;
    return t && KEYS.includes(t) ? t : "waiting";
  })();

  const makeHref = (t: Tab) => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("activeTab", t);
    return `${pathname}?${sp.toString()}`;
  };

  const { text, icon } = CONTENT[current];

  return (
    <section
      dir="rtl"
      className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6 text-right"
    >
      {/* Tabs */}
      <div
        className="mb-3 flex gap-2 text-sm"
        role="tablist"
        aria-label="تب‌های دیدگاه و پرسش"
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
              className={`relative flex items-center gap-2 rounded-full px-3.5 py-1.5 transition
                ${active ? "text-accent" : "text-slate-600 hover:text-slate-800"}`}
            >
              {t.icon}
              <span>{t.label}</span>
              {active && (
                <span className="absolute -bottom-2 left-1/2 h-[3px] w-10 -translate-x-1/2 rounded-full bg-accent" />
              )}
            </Link>
          );
        })}
      </div>

      <hr className="mb-6 border-slate-200" />

      {/* محتوا با آیکن مخصوص تب */}
      <Empty text={text} icon={icon} />
    </section>
  );
}

function Empty({ text, icon }: { text: string; icon: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon ?? <FileText className="size-24 text-slate-300" />}
      <p className="mt-6 text-sm md:text-base text-slate-700">{text}</p>
    </div>
  );
}
