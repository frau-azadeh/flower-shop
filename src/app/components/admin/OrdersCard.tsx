"use client";

import React, { useState } from "react";
import Tabs, { TabItem } from "../ui/Tabs";
import {
  Clock,
  Flower2,
  Loader2,
  PackageIcon,
  XCircle,
  Undo2,
  Search,
} from "lucide-react";
import Input from "../ui/Input";

const orderTabs: TabItem[] = [
  {
    key: "all",
    label: "همه",
    icon: <Flower2 className="size-4" />,
    emptyIcon: <Flower2 className="size-24 text-slate-300" />,
    emptyText: "هنوز سفارشی ثبت نشده است",
    badgeCount: 0,
  },
  {
    key: "pending",
    label: "در انتظار",
    icon: <Clock className="size-4" />,
    emptyIcon: <Clock className="size-24 text-slate-300" />,
    emptyText: "سفارش در انتظاری وجود ندارد",
    badgeCount: 0,
  },
  {
    key: "processing",
    label: "در حال پردازش",
    icon: <Loader2 className="size-4" />,
    emptyIcon: <Loader2 className="size-24 text-slate-300" />,
    emptyText: "سفارشی در حال پردازش نیست",
    badgeCount: 0,
  },
  {
    key: "delivered",
    label: "تحویل شده",
    icon: <PackageIcon className="size-4" />,
    emptyIcon: <PackageIcon className="size-24 text-slate-300" />,
    emptyText: "سفارش تحویل شده ای یافت نشد",
    badgeCount: 0,
  },
  {
    key: "canceled",
    label: "لغو شده",
    icon: <XCircle className="size-4" />,
    emptyIcon: <XCircle className="size-24 text-slate-300" />,
    emptyText: "سفارشی لعو نشده است",
    badgeCount: 0,
  },
  {
    key: "returned",
    label: "مرجوعی",
    icon: <Undo2 className="size-4" />,
    emptyIcon: <Undo2 className="size-24 text-slate-300" />,
    emptyText: "مرجوعی ثبت نشده است.",
    badgeCount: 0,
  },
];

const OrdersCard: React.FC = () => {
  const [question, setQuestion] = useState("");
  return (
    <section dir="rtl" className="mx-auto max-w-6xl p-4 md:p-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6 text-right">
        <div className="mb-5 flex flex-col-reverse gap-4 md:mb-6 md:flex-row md:items-center md:justify-between">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800">
            سفارشات
          </h2>

          <label className="relative w-full md:w-72">
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="جستجو (شماره یا نام مشتری)"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-4 pl-10 text-sm outline-none transition focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-500" />
          </label>
        </div>
        <Tabs tabs={orderTabs} paramName="status" />
      </div>
    </section>
  );
};

export default OrdersCard;
