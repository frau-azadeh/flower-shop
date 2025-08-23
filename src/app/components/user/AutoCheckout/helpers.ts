import type { CheckoutItem } from "@/types/AutoCheckout/types";

export function readSessionItems(): CheckoutItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem("checkout-items");
    const arr = raw ? (JSON.parse(raw) as CheckoutItem[]) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function shouldRunCheckout(params: URLSearchParams): boolean {
  if (typeof window === "undefined") return false;
  return (
    params.get("checkout") === "1" ||
    sessionStorage.getItem("checkout-flag") === "1" ||
    sessionStorage.getItem("checkout-items") !== null
  );
}

export function setSessionForReturn(items: CheckoutItem[]) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem("checkout-flag", "1");
  if (!sessionStorage.getItem("checkout-items")) {
    sessionStorage.setItem("checkout-items", JSON.stringify(items));
  }
}

export function clearSessionFlags() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem("checkout-flag");
  sessionStorage.removeItem("checkout-items");
}
