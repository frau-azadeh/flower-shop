"use client";
import { useEffect, useMemo, useState } from "react";

export type OrderRow = {
  id: string;
  status: "pending" | "paid" | "sent" | "canceled";
  fullName: string;
  phone: string;
  address: string;
  note: string | null;
  subTotal: number;
  shippingFee: number;
  grandTotal: number;
  createdAt: string;
};

export function useOrders() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/orders", { cache: "no-store" });
        const data = await res.json();
        if (res.ok && Array.isArray(data.orders)) setOrders(data.orders as OrderRow[]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const groups = useMemo(() => {
    // نگاشت وضعیت‌ها به تب‌ها
    const current = orders.filter((o) => o.status === "pending" || o.status === "paid");
    const delivered = orders.filter((o) => o.status === "sent"); // اگر وضعیت delivered جدا داری، اینجا عوض کن
    const canceled = orders.filter((o) => o.status === "canceled");
    const returned: OrderRow[] = []; // در اسکیمای فعلی وضعیت مرجوع نداریم

    return { current, delivered, returned, canceled };
  }, [orders]);

  const counts = useMemo(
    () => ({
      current: groups.current.length,
      delivered: groups.delivered.length,
      returned: groups.returned.length,
      canceled: groups.canceled.length,
    }),
    [groups]
  );

  return { loading, orders, groups, counts };
}
