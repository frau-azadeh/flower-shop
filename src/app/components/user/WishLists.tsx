"use client";
import { Bell, Heart, List, Info, ToggleRight } from "lucide-react";
import Tabs, { TabItem } from "../ui/Tabs";

const wishListTabs: TabItem[] = [
  {
    key: "favorites",
    label: "لیست علاقه مندی",
    icon: <Heart className="size-4" />,
    emptyIcon: <Heart className="size-24 text-slate-300" />,
    emptyText: "لیست علاقه‌مندی‌های شما خالی است.",
  },
  {
    key: "others",
    label: "لیست های دیگر",
    icon: <List className="size-4" />,
    emptyIcon: <List className="size-24 text-slate-300" />,
    emptyText: "هنوز لیست دیگری ایجاد نکرده‌اید.",
  },
  {
    key: "alerts",
    label: "اطلاع رسانی ها",
    icon: <Info className="size-4" />,
    header: (
      <>
        <hr className="mb-4 border-slate-200" />
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="size-5" />
            <h3 className="font-semibold">اطلاع‌رسانی‌ها</h3>
          </div>
          <button className="flex items-center rounded-full px-2 py-1 text-primary">
            <ToggleRight className="size-8" />
          </button>
        </div>
        <p className="mb-3 text-xs text-slate-500">
          اطلاع‌رسانی تخفیف و موجودی این کالاها
        </p>
        <hr className="mb-8 border-slate-200" />
      </>
    ),
    emptyIcon: <Bell className="size-24 text-slate-300" />,
    emptyText: "هنوز هیچ اعلان فعالی ندارید.",
  },
];

export default function WishLists() {
  return <Tabs tabs={wishListTabs} />;
}
