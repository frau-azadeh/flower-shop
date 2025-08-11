"use client";

import React, { useState } from "react";
import Tabs, { TabItem } from "../ui/Tabs";
import { Clock, PackageCheck, Search, Undo2, XCircle } from "lucide-react";
import Input from "../ui/Input";

const orderTabs: TabItem[] = [
  {
    key: "current",
    label: "جاری",
    icon: <Clock className="size-4" />,
    emptyIcon: <Clock className="size-24 text-slate-300" />,
    emptyText: "سفارشی در حال انجام ندارید",
    badgeCount: 0,
  },
  {
    key: "delivered",
    label: "تحویل شده",
    icon: <PackageCheck className="size-4" />,
    emptyIcon: <PackageCheck className="size-24 text-slate-300" />,
    emptyText: "سفارش تحویل شده ای وجود ندارد",
    badgeCount: 0,
  },
  {
    key: "returned",
    label: "مرجوع شده",
    icon: <Undo2 className="size-4" />,
    emptyIcon: <Undo2 className="size-24 text-slate-300" />,
    emptyText: "مورد مرجوع شده ای ندارید",
    badgeCount: 0,
  },
  {
    key: "canceled",
    label: "لغو شده",
    icon: <XCircle className="size-4" />,
    emptyIcon: <XCircle className="size-24 text-slate-300" />,
    emptyText: "سفارشی لغو نشده است",
    badgeCount: 0,
  },
];

const OrderHistory: React.FC = () => {
  const [question, setQuestion] = useState("");
  return (
    <section dir="rtl" className="mx-auto max-w-6xl p-4 md:p-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6 text-right">
        <div className="mb-5 flex flex-col-reverse gap-4 md:mb-6 md:flex-row md:items-center md:justify-between">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800">
            تاریخچه سفارشات
          </h2>
          <label className="relative w-full md:w-72">
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="جستجو"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-4 pl-10 text-sm outline-none transition focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
            <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-slate-500" />
          </label>
        </div>
        <Tabs tabs={orderTabs} paramName="status" />
      </div>
    </section>
  );
};
export default OrderHistory;
