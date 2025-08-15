"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { AdminUser } from "@/types/admin";
import { useDebouncedValue } from "./useDebouncedValue";

export function useUsers({
  fetcher,
  searchDebounceMs = 300,
}: {
  fetcher: (q: string) => Promise<AdminUser[]>;
  searchDebounceMs?: number;
}) {
  const [q, setQ] = useState("");
  const [items, setItems] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  const qDebounced = useDebouncedValue(q, searchDebounceMs);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await fetcher(qDebounced);
    setItems(data);
    setLoading(false);
  }, [fetcher, qDebounced]);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      const data = await fetcher(qDebounced);
      if (active) {
        setItems(data);
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [fetcher, qDebounced]);

  const upsertLocal = useCallback((saved: AdminUser) => {
    setItems((prev) => {
      const i = prev.findIndex((p) => p.id === saved.id);
      if (i >= 0) {
        const copy = [...prev];
        copy[i] = saved;
        return copy;
      }
      return [saved, ...prev];
    });
  }, []);

  const removeLocal = useCallback((id: string) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
  }, []);

  return useMemo(
    () => ({ q, setQ, items, loading, load, upsertLocal, removeLocal }),
    [q, items, loading, load, upsertLocal, removeLocal],
  );
}
