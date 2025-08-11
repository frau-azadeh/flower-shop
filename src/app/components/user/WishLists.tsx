"use client";
import React from "react";
import Tabs, { TabItem } from "../ui/Tabs";
import { Bell, Heart, Info, List, ToggleRight } from "lucide-react";
import Button from "../ui/Button";

const wishListTabs: TabItem[] = [
  {
    key: "favorites",
    label: "لیست علاقه مندی",
    icon: <Heart className="size-4" />,
    emptyIcon: <Heart className="size-24 text-slate-300" />,
    emptyText: "لیست غلاقه مندی های شما خالی است",
  },
  {
    key: "others",
    label: "لیست های دیگر",
    icon: <List className="size-4" />,
    emptyIcon: <List className="size-24 text-slate-300" />,
    emptyText: "هنوز لیست دیگری ایجاد نکرده اید",
  },
  {
    key: "alerts",
    label: " اطلاع رسانی ها",
    icon: <Info className="size-4" />,
    header: (
      <>
        <hr className="mb-4 border-slate-200" />
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="size-5" />
            <h3 className="font-semibold">اطلاع رسانی ها</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-primary rounded-full"
            icon={<ToggleRight className="size-8" />}
          />
        </div>
        <p className="mb-3 text-sm text-slate-500">
          اطلاع رسانی و تخفیف و موجودی این کالا ها
        </p>
        <hr className="mb-8 border-slate-200" />
      </>
    ),
    emptyIcon: <Bell className="size-24 text-slate-300" />,
    emptyText: "هنوز هیچ اعلان فعالی ندارید",
  },
];

const WishLists: React.FC = () => {
  return (
    <div>
      <Tabs tabs={wishListTabs} paramName="status" />
    </div>
  );
};

export default WishLists;
