"use client";

import { useCallback, useEffect, useState } from "react";
import { createSupabaseClient } from "@/lib/supabase";
import { fetchOrders, fetchProfileById } from "./api";
import type { OrderRow, Profile } from "@/types/OrderHistory/types";

export function useOrders(refreshKey: string) {
  const sb = createSupabaseClient();

  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const json = await fetchOrders();
      setOrders(json.ok && Array.isArray(json.orders) ? json.orders : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    (async () => {
      const { data: u } = await sb.auth.getUser();
      const uid = u.user?.id ?? null;
      setUserId(uid);
      if (uid) {
        const prof = await fetchProfileById(sb, uid);
        setProfile(prof);
      } else {
        setProfile(null);
      }
    })();
  }, [sb]);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders, refreshKey]);

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
        () => loadOrders(),
      )
      .subscribe();
    return () => {
      sb.removeChannel(channel);
    };
  }, [sb, userId, loadOrders]);

  return { orders, loading, profile, loadOrders };
}
