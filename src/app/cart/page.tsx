"use client";

import { useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store/store";
import { removeItem, setQty } from "@/store/orders/cartSlice";
import { useRouter } from "next/navigation";

import CartItemCard, { CartEntry } from "./components/CartItemCard";
import CartSummary from "./components/CartSummary";
import EmptyCart from "./components/EmptyCart";

type MinimalItem = { productId: string; qty: number };

function clampQty(n: number): number {
  return Number.isFinite(n) ? Math.max(1, Math.floor(n)) : 1;
}

export default function CartPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  // فرض: s.cart.items یک آبجکت از آیتم‌هاست؛ به آرایه تبدیل می‌کنیم
  const items = useSelector((s: RootState) =>
    Object.values(s.cart.items)
  ) as CartEntry[];

  const { total, count } = useMemo(() => {
    const t = items.reduce(
      (sum, it) => sum + (typeof it.price === "number" ? it.price : 0) * it.qty,
      0
    );
    const c = items.reduce((s, it) => s + it.qty, 0);
    return { total: t, count: c };
  }, [items]);

  // اکشن‌ها را به‌صورت کال‌بک به کامپوننت‌ها می‌دهیم
  const onDec = useCallback(
    (id: string, current: number) =>
      dispatch(setQty({ productId: id, qty: clampQty(current - 1) })),
    [dispatch]
  );
  const onInc = useCallback(
    (id: string, current: number) =>
      dispatch(setQty({ productId: id, qty: clampQty(current + 1) })),
    [dispatch]
  );
  const onInput = useCallback(
    (id: string, value: string) =>
      dispatch(setQty({ productId: id, qty: clampQty(Number(value)) })),
    [dispatch]
  );
  const onRemove = useCallback(
    (id: string) => dispatch(removeItem({ productId: id })),
    [dispatch]
  );

  const goCheckout = (): void => {
    const minimal: MinimalItem[] = items
      .map((it) => ({ productId: it.productId, qty: it.qty }))
      .filter((x) => x.productId && x.qty > 0);

    if (minimal.length === 0) return;

    if (typeof window !== "undefined") {
      sessionStorage.setItem("checkout-items", JSON.stringify(minimal));
      sessionStorage.setItem("checkout-flag", "1");
    }
    router.push("/user/dashboard?checkout=1");
  };

  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <main dir="rtl" className="mx-auto max-w-6xl px-4 py-8 h-screen">
      <h1 className="mb-5 text-xl font-extrabold tracking-tight text-slate-900">
        سبد خرید
      </h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_320px]">
        <section className="space-y-3">
          {items.map((it) => (
            <CartItemCard
              key={it.productId}
              item={it}
              onDec={onDec}
              onInc={onInc}
              onInput={onInput}
              onRemove={onRemove}
            />
          ))}
        </section>

        <CartSummary count={count} total={total} onCheckout={goCheckout} />
      </div>
    </main>
  );
}
