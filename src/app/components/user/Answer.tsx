"use client";

import Tabs, { TabItem } from "@/app/components/ui/Tabs";
import {
  MessageCircleHeart,
  MessageCircleWarning,
  MessageSquare,
} from "lucide-react";

export default function Answer() {
  const tabs: TabItem[] = [
    {
      key: "waiting",
      label: "در انتظار دیدگاه",
      icon: <MessageCircleWarning className="size-4" />,
      emptyIcon: <MessageCircleWarning className="size-24 text-slate-300" />,
      emptyText: "هیچ موردی در انتظار بررسی نیست.",
    },
    {
      key: "opinion",
      label: "دیدگاه من",
      icon: <MessageCircleHeart className="size-4" />,
      emptyIcon: <MessageCircleHeart className="size-24 text-slate-300" />,
      emptyText: "هنوز دیدگاهی ثبت نکرده‌اید.",
    },
    {
      key: "question",
      label: "پرسش و پاسخ",
      icon: <MessageSquare className="size-4" />,
      emptyIcon: <MessageSquare className="size-24 text-slate-300" />,
      emptyText: "لیست سوال‌های شما خالی است.",
    },
  ];

  return (
    <section
      dir="rtl"
      className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6 text-right"
    >
      <Tabs tabs={tabs} paramName="activeTab" />
    </section>
  );
}
