"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Tabs, { type TabItem } from "../Tabs";
import { Clock, PackageCheck, Undo2, XCircle } from "lucide-react";
import { useOrders } from "./useOrders";
import { groupByStatus } from "./utils";
import OrderCard from "./OrderCard";
import { toast } from "react-hot-toast";
import { confirmToast } from "@/app/components/ui/confirmToast";

const baseTabs: TabItem[] = [
  { key: "current", label: "جاری", icon: <Clock className="size-4" /> },
  {
    key: "delivered",
    label: "تحویل شده",
    icon: <PackageCheck className="size-4" />,
  },
  { key: "returned", label: "مرجوع شده", icon: <Undo2 className="size-4" /> },
  { key: "canceled", label: "لغو شده", icon: <XCircle className="size-4" /> },
  { key: "other", label: "دیگر", icon: <Clock className="size-4" /> },
];

export default function OrderHistory() {
  const params = useSearchParams();
  const { orders, loading, profile, loadOrders } = useOrders(params.toString());

  const groups = useMemo(() => groupByStatus(orders), [orders]);

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
  const profileIncomplete = !profile?.fullName || !profile?.phone;

  // --- اکشن‌ها با toast ---
  const cancelOrder = async (id: string) => {
    const ok = await confirmToast({
      message: "لغو سفارش انجام شود؟",
      confirmText: "بله، لغو کن",
      cancelText: "انصراف",
    });
    if (!ok) return;

    try {
      await toast.promise(
        fetch(`/api/orders/${id}/cancel`, { method: "POST" }).then((r) => {
          if (!r.ok) throw new Error("FAILED");
        }),
        {
          loading: "در حال لغو…",
          success: "سفارش لغو شد.",
          error: "لغو سفارش ناموفق بود.",
        },
      );
      loadOrders();
    } catch {
      /* پیام خطا در toast.promise نمایش داده شد */
    }
  };

  const payOrder = async (id: string) => {
    try {
      await toast.promise(
        fetch(`/api/orders/${id}/pay`, { method: "POST" }).then((r) => {
          if (!r.ok) throw new Error("FAILED");
        }),
        {
          loading: "در حال ثبت پرداخت…",
          success: "پرداخت ثبت شد.",
          error: "ثبت پرداخت ناموفق بود.",
        },
      );
      loadOrders();
    } catch {
      /* پیام خطا در toast.promise نمایش داده شد */
    }
  };

  return (
    <section dir="rtl" className="mx-auto max-w-6xl p-4 md:p-6">
      {profileIncomplete && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm">
          نام و تلفن شما کامل نیست{" "}
          <a
            href="/user/address?address=new"
            className="text-amber-700 underline"
          >
            ثبت اطلاعات
          </a>
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
              <OrderCard
                key={o.id}
                order={o}
                profileIncomplete={profileIncomplete}
                onCancel={cancelOrder}
                onPay={payOrder}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
