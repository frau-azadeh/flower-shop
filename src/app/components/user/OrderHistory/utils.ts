import type { OrderRow } from "@/types/OrderHistory/types";

export const rial = (n: number) => `${n.toLocaleString("fa-IR")} تومان`;
export const norm = (s?: string) => (s ?? "").trim().toLowerCase();

export function groupByStatus(orders: OrderRow[]) {
  const current: OrderRow[] = [];
  const delivered: OrderRow[] = [];
  const canceled: OrderRow[] = [];
  const returned: OrderRow[] = [];
  const other: OrderRow[] = [];

  for (const o of orders) {
    const s = norm(o.status);
    if (s === "pending" || s === "paid") current.push(o);
    else if (s === "sent" || s === "delivered") delivered.push(o);
    else if (s === "canceled" || s === "cancelled") canceled.push(o);
    else if (s === "returned") returned.push(o);
    else other.push(o);
  }
  return { current, delivered, returned, canceled, other };
}
