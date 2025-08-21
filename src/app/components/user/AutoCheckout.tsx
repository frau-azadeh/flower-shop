// app/components/user/AutoCheckout.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearCart } from "@/store/orders/cartSlice";
import { createSupabaseClient } from "@/lib/supabase";
import { selectCartItemsArray } from "@/store/selectors";
import type { CartItem as StoreCartItem } from "@/store/orders/cartSlice";

/* ---------- Types ---------- */
type CheckoutItem = Pick<StoreCartItem, "productId" | "qty">;

type Profile = {
  id: string;
  fullName: string | null;
  phone: string | null;
  address: string | null;
  email: string | null;
};

type ProfileRes =
  | { ok: true; profile: Profile | null }
  | { ok: false; message: string };

/* ---------- Component ---------- */
export default function AutoCheckout() {
  const params = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const started = useRef(false);

  const fromStore = useAppSelector(selectCartItemsArray);

  // اقلام نهایی؛ از استور، و اگر نبود از سشن
  const items: CheckoutItem[] = useMemo(() => {
    if (fromStore.length > 0) {
      return fromStore.map(({ productId, qty }) => ({ productId, qty }));
    }
    if (typeof window === "undefined") return [];
    try {
      const raw = sessionStorage.getItem("checkout-items");
      const arr = raw ? (JSON.parse(raw) as CheckoutItem[]) : [];
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }, [fromStore]);

  // شرط اجرا: ?checkout=1 یا فلگ سشن
  const shouldRun =
    params.get("checkout") === "1" ||
    (typeof window !== "undefined" &&
      (sessionStorage.getItem("checkout-flag") === "1" ||
        sessionStorage.getItem("checkout-items") !== null));

  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!shouldRun || started.current) return;
    started.current = true;

    (async () => {
      // اگر آیتمی نداریم، هیچ کاری
      if (items.length === 0) {
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("checkout-flag");
          sessionStorage.removeItem("checkout-items");
        }
        return;
      }

      const sb = createSupabaseClient();
      const { data: u } = await sb.auth.getUser();
      if (!u.user) {
        // بعد از لاگین دوباره برمی‌گرده و ادامه می‌دهد
        router.replace("/auth/login?redirect=/user/dashboard?checkout=1");
        return;
      }

      // 1) پروفایل واقعی را از API داخلی بگیر
      let profile: Profile | null = null;
      try {
        const pr = await fetch("/api/profile", {
          credentials: "include",
          cache: "no-store",
        });
        const data = (await pr.json()) as ProfileRes;
        if (pr.ok && data.ok) profile = data.profile ?? null;
      } catch {
        // اگر API پروفایل قطع بود، ادامه نمی‌دهیم
      }

      const fullName = profile?.fullName?.trim() ?? "";
      const phone = profile?.phone?.trim() ?? "";
      const address = profile?.address?.trim() ?? "";

      // 2) اگر پروفایل ناقص است، کاربر را به فرم آدرس هدایت کن
      const incomplete =
        fullName.length < 2 || phone.length < 5 || address.length < 10;
      if (incomplete) {
        // آیتم‌ها و فلگ را نگه داریم تا بعد از تکمیل برگردد و ثبت انجام شود
        if (typeof window !== "undefined") {
          sessionStorage.setItem("checkout-flag", "1");
          if (!sessionStorage.getItem("checkout-items")) {
            sessionStorage.setItem("checkout-items", JSON.stringify(items));
          }
        }
        router.replace(
          "/user/address?address=new&next=/user/dashboard?checkout=1",
        );
        return;
      }

      // 3) سفارش را با مشخصات واقعی ارسال کن
      try {
        const res = await fetch("/api/orders", {
          method: "POST",
          credentials: "include",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            fullName,
            phone,
            address,
            items,
          }),
        });

        const json: { ok: boolean; orderId?: string; message?: string } =
          await res.json();

        if (!res.ok || !json.ok) {
          setMsg(json?.message ?? "ثبت سفارش ناموفق بود");
          return;
        }

        // موفق: پاکسازی و رفرش لیست
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("checkout-flag");
          sessionStorage.removeItem("checkout-items");
        }
        dispatch(clearCart());
        router.replace(`/user/dashboard?r=${Date.now()}`);
      } catch (e) {
        setMsg(e instanceof Error ? e.message : "NETWORK_ERROR");
      }
    })();
  }, [shouldRun, items, router, dispatch]);

  return msg ? <p className="mb-2 text-sm text-red-600">{msg}</p> : null;
}
