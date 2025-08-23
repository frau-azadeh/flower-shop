import type { SupabaseClient } from "@supabase/supabase-js";
import type { OrdersResponse, Profile } from "@/types/OrderHistory/types";

export async function fetchOrders(): Promise<OrdersResponse> {
  const res = await fetch("/api/orders", {
    credentials: "include",
    cache: "no-store",
    headers: { "x-refresh": String(Date.now()) },
  });
  return (await res.json()) as OrdersResponse;
}

export async function cancelOrderApi(id: string): Promise<boolean> {
  const res = await fetch(`/api/orders/${id}/cancel`, { method: "POST" });
  return res.ok;
}

export async function payOrderApi(id: string): Promise<boolean> {
  const res = await fetch(`/api/orders/${id}/pay`, { method: "POST" });
  return res.ok;
}

/** ساده، بدون جنریک و بدون any */
export async function fetchProfileById(
  sb: SupabaseClient,
  uid: string,
): Promise<Profile | null> {
  const { data } = await sb
    .from("profiles")
    .select("id, fullName, phone, address")
    .eq("id", uid)
    .maybeSingle();

  return (data as Profile | null) ?? null;
}
