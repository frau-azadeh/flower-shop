// app/components/user/OrderHistory.tsx
"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Tabs, { TabItem } from "./Tabs";
import { Clock, PackageCheck, Undo2, XCircle } from "lucide-react";
import { createSupabaseClient } from "@/lib/supabase";

/* ---------- انواع ---------- */
type OrderItem = {
  productName: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
};

type OrderRow = {
  id: string;
  status: string;
  fullName: string | null;
  phone: string | null;
  address: string | null;
  note: string | null;
  subTotal: number;
  shippingFee: number;
  grandTotal: number;
  createdAt: string;
  items: OrderItem[];
};

type Profile = {
  id: string;
  fullName: string | null;
  phone: string | null;
  address: string | null;
};

/* ---------- کمک‌تابع ---------- */
const rial = (n: number) => `${n.toLocaleString("fa-IR")} تومان`;
const norm = (s?: string) => (s ?? "").trim().toLowerCase();

const baseTabs: TabItem[] = [
  { key: "current", label: "جاری", icon: <Clock className="size-4" /> },
  {
    key: "delivered",
    label: "تحویل شده",
    icon: <PackageCheck className="size-4" />,
  },
  { key: "returned", label: "مرجوع شده", icon: <Undo2 className="size-4" /> },
  { key: "canceled", label: "لغو شده", icon: <XCircle className="size-4" /> },
  // یک تب کمکی اگر status ناشناس بود:
  { key: "other", label: "دیگر", icon: <Clock className="size-4" /> },
];

export default function OrderHistory() {
  const params = useSearchParams();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const sb = createSupabaseClient();
  const profileIncomplete = !profile?.fullName || !profile?.phone;

  /* --- گرفتن userId و پروفایل --- */
  useEffect(() => {
    (async () => {
      const { data: u } = await sb.auth.getUser();
      const uid = u.user?.id ?? null;
      setUserId(uid);
      if (!uid) return setProfile(null);
      const { data } = await sb
        .from("profiles")
        .select("id, fullName, phone, address")
        .eq("id", uid)
        .maybeSingle<Profile>();
      setProfile(data ?? null);
    })();
  }, [sb]);

  /* --- فچ سفارش‌ها (تابع قابل‌استفاده مجدد) --- */
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        credentials: "include",
        cache: "no-store",
        headers: { "x-refresh": String(Date.now()) }, // شکستن هر کش
      });
      const json: { ok: boolean; orders?: OrderRow[] } = await res.json();
      setOrders(
        res.ok && json.ok && Array.isArray(json.orders) ? json.orders : [],
      );
    } finally {
      setLoading(false);
    }
  }, []);

  /* --- بار اول + هر تغییر پارامتر (r=timestamp) --- */
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders, params.toString()]);

  /* --- ریِل‌تایم: هر insert/update روی orders مربوط به این کاربر → رفرش --- */
  useEffect(() => {
    if (!userId) return;
    const channel = sb
      .channel(`orders-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
          filter: `userId=eq.${userId}`,
        },
        () => fetchOrders(),
      )
      .subscribe();
    return () => {
      sb.removeChannel(channel);
    };
  }, [sb, userId, fetchOrders]);

  /* --- گروه‌بندی با نرمال‌سازی status --- */
  const groups = useMemo(() => {
    const current: OrderRow[] = [];
    const delivered: OrderRow[] = [];
    const canceled: OrderRow[] = [];
    const returned: OrderRow[] = []; // فعلاً نداریم
    const other: OrderRow[] = [];

    for (const o of orders) {
      const s = norm(o.status);
      if (s === "pending" || s === "paid") current.push(o);
      else if (s === "sent" || s === "delivered") delivered.push(o);
      else if (s === "canceled" || s === "cancelled") canceled.push(o);
      else if (s === "returned") returned.push(o);
      else other.push(o); // اگر هر status عجیب ذخیره شده باشد، اینجا دیده می‌شود
    }

    return { current, delivered, returned, canceled, other };
  }, [orders]);

  const counts = {
    current: groups.current.length,
    delivered: groups.delivered.length,
    returned: groups.returned.length,
    canceled: groups.canceled.length,
    other: groups.other.length,
  };

  const tabs: TabItem[] = baseTabs.map((t) => ({
    ...t,
    badgeCount: counts[t.key as keyof typeof counts] ?? 0,
  }));

  const activeKey = (params.get("status") ?? "current") as keyof typeof groups;
  const visible = groups[activeKey] ?? [];

  /* --- اکشن‌ها --- */
  const cancelOrder = async (id: string) => {
    if (!confirm("لغو سفارش انجام شود؟")) return;
    const res = await fetch(`/api/orders/${id}/cancel`, { method: "POST" });
    if (res.ok) fetchOrders();
  };

  const payOrder = async (id: string) => {
    const res = await fetch(`/api/orders/${id}/pay`, { method: "POST" });
    if (res.ok) fetchOrders();
  };

  return (
    <section dir="rtl" className="mx-auto max-w-6xl p-4 md:p-6">
      {profileIncomplete && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm">
          نام و تلفن شما کامل نیست.{" "}
          <Link
            href="/user/address?address=new"
            className="text-amber-700 underline"
          >
            ثبت اطلاعات
          </Link>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6">
        <Tabs tabs={tabs} paramsName="status" />

        {!loading && visible.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Clock className="size-24 text-slate-300" />
            <p className="mt-4 text-slate-700">موردی برای نمایش نیست.</p>
          </div>
        )}

        {!loading && visible.length > 0 && (
          <div className="mt-4 space-y-4">
            {visible.map((o) => (
              <article
                key={o.id}
                className="rounded-2xl border border-slate-200 bg-slate-50"
              >
                <header className="flex flex-col gap-2 border-b border-slate-200 px-4 py-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs rounded-full px-2 py-0.5 border ${
                        norm(o.status) === "pending"
                          ? "border-yellow-300 text-yellow-700 bg-yellow-50"
                          : norm(o.status) === "paid"
                            ? "border-emerald-300 text-emerald-700 bg-emerald-50"
                            : norm(o.status) === "sent"
                              ? "border-blue-300 text-blue-700 bg-blue-50"
                              : norm(o.status) === "canceled" ||
                                  norm(o.status) === "cancelled"
                                ? "border-rose-300 text-rose-700 bg-rose-50"
                                : "border-slate-300 text-slate-600 bg-white"
                      }`}
                    >
                      {o.status}
                    </span>
                    <time className="text-xs text-slate-500">
                      {new Date(o.createdAt).toLocaleString("fa-IR")}
                    </time>
                  </div>
                  <div className="text-xs text-slate-600">
                    <span className="font-semibold">کد سفارش: </span>
                    {o.id}
                  </div>
                </header>

                <div className="px-4 py-3">
                  <h4 className="mb-2 font-semibold text-slate-700">
                    اقلام سفارش
                  </h4>
                  {o.items.length === 0 ? (
                    <div className="rounded-xl bg-white px-3 py-2 text-sm text-slate-500">
                      قلمی ثبت نشده است.
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-xl bg-white">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-slate-500">
                            <th className="px-3 py-2 text-right font-medium">
                              نام کالا
                            </th>
                            <th className="px-3 py-2 text-center font-medium">
                              تعداد
                            </th>
                            <th className="px-3 py-2 text-left font-medium">
                              قیمت واحد
                            </th>
                            <th className="px-3 py-2 text-left font-medium">
                              مبلغ
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {o.items.map((it, i) => (
                            <tr key={i} className="border-t">
                              <td className="px-3 py-2">{it.productName}</td>
                              <td className="px-3 py-2 text-center">
                                × {it.qty}
                              </td>
                              <td className="px-3 py-2">
                                {rial(it.unitPrice)}
                              </td>
                              <td className="px-3 py-2 font-medium">
                                {rial(it.lineTotal)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <footer className="grid gap-4 px-4 pb-4 md:grid-cols-[1fr_auto] md:items-end">
                  <div className="text-sm leading-7">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">جمع جزء</span>
                      <span className="font-medium">{rial(o.subTotal)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">هزینه ارسال</span>
                      <span className="font-medium">{rial(o.shippingFee)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">کل مبلغ</span>
                      <span className="font-bold">{rial(o.grandTotal)}</span>
                    </div>
                    <div className="mt-3 grid gap-1 text-xs text-slate-600">
                      <div>نام خریدار: {o.fullName || "—"}</div>
                      <div>تلفن: {o.phone || "—"}</div>
                      <div>آدرس: {o.address || "—"}</div>
                    </div>
                  </div>

                  <div className="flex flex-col-reverse gap-2 md:flex-col">
                    {profileIncomplete && (
                      <Link
                        href="/user/address?address=new"
                        className="inline-flex items-center justify-center rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-700 hover:bg-amber-100"
                      >
                        ثبت اطلاعات
                      </Link>
                    )}
                    {(norm(o.status) === "pending" ||
                      norm(o.status) === "paid") && (
                      <button
                        onClick={() => cancelOrder(o.id)}
                        className="inline-flex items-center justify-center rounded-xl bg-rose-600 px-4 py-2 text-sm text-white hover:bg-rose-700"
                      >
                        لغو سفارش
                      </button>
                    )}
                    {norm(o.status) === "pending" && (
                      <button
                        onClick={() => payOrder(o.id)}
                        className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm text-white hover:opacity-90"
                      >
                        تایید پرداخت
                      </button>
                    )}
                  </div>
                </footer>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
