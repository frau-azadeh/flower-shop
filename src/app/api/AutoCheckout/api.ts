import type {
  CheckoutItem,
  Profile,
  ProfileRes,
  SubmitOrderRes,
} from "@/types/AutoCheckout/types";

export async function getProfileViaApi(): Promise<Profile | null> {
  const res = await fetch("/api/profile", {
    credentials: "include",
    cache: "no-store",
  });
  const data = (await res.json()) as ProfileRes;
  return res.ok && data.ok ? (data.profile ?? null) : null;
}

export async function submitOrder(payload: {
  fullName: string;
  phone: string;
  address: string;
  items: CheckoutItem[];
}): Promise<SubmitOrderRes> {
  const res = await fetch("/api/orders", {
    method: "POST",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  return (await res.json()) as SubmitOrderRes;
}
