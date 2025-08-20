"use client";
import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearCart } from "@/store/orders/cartSlice";
import { selectCartItemsArray } from "@/store/selectors";
import { createSupabaseClient } from "@/lib/supabase";

export default function AutoCheckout() {
  const params = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const shouldRun = params.get("checkout") === "1";
  const items = useAppSelector(selectCartItemsArray);
  const started = useRef(false);

  useEffect(() => {
    if (!shouldRun || started.current) return;
    started.current = true;

    (async () => {
      if (items.length === 0) {
        router.replace("/user/dashboard");
        return;
      }

      const sb = createSupabaseClient();
      const { data: u } = await sb.auth.getUser();
      if (!u.user) {
        router.replace("/auth/login?redirect=/user/dashboard?checkout=1");
        return;
      }

      const { data: profile } = await sb
        .from("profiles")
        .select("fullName, phone, address")
        .eq("id", u.user.id)
        .single();

      if (!profile?.fullName || !profile?.phone || !profile?.address) {
        router.replace("/auth/login?redirect=/user/dashboard?checkout=1");
        return;
      }

      try {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            fullName: profile.fullName,
            phone: profile.phone,
            address: profile.address,
            items: items.map((it) => ({
              productId: it.productId,
              qty: it.qty,
            })),
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message ?? "ثبت سفارش ناموفق بود");

        dispatch(clearCart());
        router.replace("/user/dashboard"); // پارامتر پاک می‌شود
      } catch {
        router.replace("/user/dashboard");
      }
    })();
  }, [shouldRun, items, router, dispatch]);

  return null;
}
