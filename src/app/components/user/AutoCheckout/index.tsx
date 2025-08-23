"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearCart } from "@/store/orders/cartSlice";
import { selectCartItemsArray } from "@/store/selectors";

import { getProfileViaApi, submitOrder } from "@/app/api/AutoCheckout/api";
import {
  readSessionItems,
  shouldRunCheckout,
  setSessionForReturn,
  clearSessionFlags,
} from "./helpers";
import type { CheckoutItem, Profile } from "@/types/AutoCheckout/types";

export default function AutoCheckout() {
  const params = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const started = useRef(false);

  const storeItems = useAppSelector(selectCartItemsArray);

  const items: CheckoutItem[] = useMemo(() => {
    if (storeItems.length > 0) {
      return storeItems.map(({ productId, qty }) => ({ productId, qty }));
    }
    return readSessionItems();
  }, [storeItems]);

  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!shouldRunCheckout(params)) return;
    if (started.current) return;
    started.current = true;

    (async () => {
      if (items.length === 0) {
        clearSessionFlags();
        return;
      }

      const sb = createSupabaseClient();
      const { data: u } = await sb.auth.getUser();
      if (!u.user) {
        router.replace("/auth/login?redirect=/user/dashboard?checkout=1");
        return;
      }

      let profile: Profile | null = null;
      try {
        profile = await getProfileViaApi();
      } catch {
        setMsg("عدم دسترسی به سرویس پروفایل");
        return;
      }

      const fullName = profile?.fullName?.trim() ?? "";
      const phone = profile?.phone?.trim() ?? "";
      const address = profile?.address?.trim() ?? "";
      const incomplete =
        fullName.length < 2 || phone.length < 5 || address.length < 10;

      if (incomplete) {
        setSessionForReturn(items);
        router.replace(
          "/user/address?address=new&next=/user/dashboard?checkout=1",
        );
        return;
      }

      try {
        const res = await submitOrder({ fullName, phone, address, items });
        if (!res.ok) {
          setMsg(res.message ?? "ثبت سفارش ناموفق بود");
          return;
        }
        clearSessionFlags();
        dispatch(clearCart());
        router.replace(`/user/dashboard?r=${Date.now()}`);
      } catch (e) {
        setMsg(e instanceof Error ? e.message : "NETWORK_ERROR");
      }
    })();
  }, [params, items, router, dispatch]);

  return msg ? <p className="mb-2 text-sm text-red-600">{msg}</p> : null;
}
