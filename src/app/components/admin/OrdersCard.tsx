"use client";

import React, { useEffect, useMemo, useState } from "react";
import Tab, { TabItem } from "../ui/Tab";
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
import { useSearchParams, useRouter } from "next/navigation";

type OrderItem = {
  productName: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
};

type OrderRow = {
  id: string;
  userId: string;
  status: "pending" | "paid" | "sent" | "canceled" | "returned";
  fullName: string;
  phone: string;
  address: string;
  note?: string | null;
  subTotal: number;
  shippingFee: number;
  grandTotal: number;
  createdAt: string;
  items: OrderItem[];
};

const baseTabs: TabItem[] = [
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
    emptyText: "سفارش تحویل‌شده‌ای یافت نشد",
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
  {
    key: "returned",
    label: "مرجوعی",
    icon: <Undo2 className="size-4" />,
    emptyIcon: <Undo2 className="size-24 text-slate-300" />,
    emptyText: "مرجوعی ثبت نشده است.",
    badgeCount: 0,
  },
];

const rial = (n: number) => `${n.toLocaleString("fa-IR")} تومان`;
const norm = (s?: string) => (s ?? "").trim().toLowerCase();

const OrdersCard: React.FC = () => {
  const router = useRouter();
  const params = useSearchParams();

  const [question, setQuestion] = useState<string>("");
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [counts, setCounts] = useState<Record<string, number>>({
    all: 0,
    pending: 0,
    processing: 0,
    delivered: 0,
    canceled: 0,
    returned: 0,
  });

  const activeKey = (params.get("status") ?? "all").toLowerCase();

  // تب‌ها با شمارنده‌ها
  const tabs: TabItem[] = useMemo(
    () => baseTabs.map((t) => ({ ...t, badgeCount: counts[t.key] ?? 0 })),
    [counts],
  );

  // فچ دیتای تب فعال
  useEffect(() => {
    setLoading(true);
    let alive = true;

    const query = new URLSearchParams();
    query.set("status", activeKey);
    if (question.trim()) query.set("q", question.trim());

    (async () => {
      try {
        const r = await fetch(`/api/admin/orders?${query.toString()}`, {
          cache: "no-store",
          credentials: "include",
        });

        const json = (await r.json()) as {
          ok: boolean;
          orders?: OrderRow[];
          counts?: Record<string, number>;
        };

        if (!alive) return;

        if (!r.ok || !json?.ok) {
          setOrders([]);
          setCounts({
            all: 0,
            pending: 0,
            processing: 0,
            delivered: 0,
            canceled: 0,
            returned: 0,
          });
          return;
        }

        setOrders(json.orders ?? []);
        setCounts(
          json.counts ?? {
            all: 0,
            pending: 0,
            processing: 0,
            delivered: 0,
            canceled: 0,
            returned: 0,
          },
        );
      } catch (e: unknown) {
        if (e instanceof DOMException && e.name === "AbortError") return;
        // می‌توانی لاگ بگیری
        // console.error(e);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [activeKey, question]);

  // اگر Tabs شما onChange را ساپورت می‌کند، می‌توانی از آن استفاده کنی؛
  // در این نسخه از لینک‌های داخلی Tabs استفاده می‌شود.
  const selectedTab = tabs.find((t) => t.key === activeKey) ?? tabs[0];

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

        {/* Tabs: پیام خالی فقط وقتی نمایش داده می‌شود که واقعاً سفارشی نباشد */}
        <Tab
          tabs={tabs}
          paramsName="status"
          showEmpty={!loading && orders.length === 0}
        />

        {/* لیست */}
        <div className="mt-4">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-slate-500">
              در حال بارگذاری…
            </div>
          ) : orders.length === 0 ? null : ( // پیام خالی را Tabs نشان داده؛ اینجا چیزی لازم نیست
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-3 py-2 text-right font-medium">
                      کد سفارش
                    </th>
                    <th className="px-3 py-2 text-right font-medium">مشتری</th>
                    <th className="px-3 py-2 text-right font-medium">تلفن</th>
                    <th className="px-3 py-2 text-right font-medium">وضعیت</th>
                    <th className="px-3 py-2 text-right font-medium">
                      تعداد اقلام
                    </th>
                    <th className="px-3 py-2 text-right font-medium">
                      مبلغ کل
                    </th>
                    <th className="px-3 py-2 text-right font-medium">تاریخ</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="border-t">
                      <td className="px-3 py-2 font-mono text-xs">{o.id}</td>
                      <td className="px-3 py-2">{o.fullName}</td>
                      <td className="px-3 py-2">{o.phone}</td>
                      <td className="px-3 py-2 capitalize">
                        <span
                          className={`text-xs rounded-full px-2 py-0.5 border ${
                            norm(o.status) === "pending"
                              ? "border-yellow-300 text-yellow-700 bg-yellow-50"
                              : norm(o.status) === "paid"
                                ? "border-emerald-300 text-emerald-700 bg-emerald-50"
                                : norm(o.status) === "sent"
                                  ? "border-blue-300 text-blue-700 bg-blue-50"
                                  : norm(o.status) === "canceled"
                                    ? "border-rose-300 text-rose-700 bg-rose-50"
                                    : "border-slate-300 text-slate-600 bg-white"
                          }`}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        {o.items.reduce<number>((s, it) => s + it.qty, 0)}
                      </td>
                      <td className="px-3 py-2 font-medium">
                        {rial(o.grandTotal)}
                      </td>
                      <td className="px-3 py-2">
                        {new Date(o.createdAt).toLocaleString("fa-IR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default OrdersCard;
