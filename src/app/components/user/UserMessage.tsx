"use client";

import { Archive, Inbox, Mail, Star } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { ReactNode, useEffect } from "react";

type Tab = "inbox" | "unread" | "starred" | "archive";

const TABS: { key: Tab; label: string; icon: ReactNode }[] = [
  { key: "inbox", label: "همه پیامها", icon: <Inbox className="size-4" /> },
  { key: "unread", label: "خوانده نشده", icon: <Mail className="size-4" /> },
  { key: "starred", label: "ستاره دار", icon: <Star className="size-4" /> },
  { key: "archive", label: "بایگانی", icon: <Archive className="size-4" /> },
];

const CONTENT: Record<Tab, { text: string; icon: ReactNode }> = {
  inbox: {
    text: "هنوز پیامی در صندوق شما نیست",
    icon: <Inbox className="size-24 text-slate-300" />,
  },
  unread: {
    text: "پیام خوانده نشده ای ندارید",
    icon: <Mail className="size-24 text-slate-300" />,
  },
  starred: {
    text: "پیام ستاره دار ثبت نشده است",
    icon: <Star className="size-24 text-slate-300" />,
  },
  archive: {
    text: "پیامی در بایگانی وحود ندارد",
    icon: <Archive className="size-24 text-slate-300" />,
  },
};

const UserMessage: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const KEYS: Tab[] = ["inbox", "unread", "starred", "archive"];
  const current: Tab = (() => {
    const v = searchParams.get("activeTab") as Tab | null;
    return v && KEYS.includes(v) ? v : "inbox";
  })();

  const makeHref = (t: Tab) => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("activeTab", t);
    return `${pathname}?${sp.toString()}`;
  };

  const { text, icon } = CONTENT[current];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6 text-right">
      <div
        className="mb-3 flex gap-2 "
        role="tablist"
        aria-label="تب های پیام ها"
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
                    ${active ? "text-accent" : "text-slate-600 hover-slate-800"}`}
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

      <div className="flex flex-col items-center justify-center py-16 text-center">
        {icon}
        <p className="mt-6 text-sm md:text-base text-slate-700">{text}</p>
      </div>
    </section>
  );
};

export default UserMessage;
