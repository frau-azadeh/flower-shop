"use client";

import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store/store";
import { removeItem, setQty } from "@/store/orders/cartSlice";
import { useRouter } from "next/navigation";

type MinimalItem = { productId: string; qty: number };

export default function CartPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const items = useSelector((s: RootState) => Object.values(s.cart.items));

  const total = items.reduce(
    (sum, it) => sum + (typeof it.price === "number" ? it.price : 0) * it.qty,
    0,
  );

  const goCheckout = (): void => {
    // فقط فیلدهای لازم برای API
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
    return <div className="container mx-auto px-4 py-6">سبد شما خالی است.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">سبد خرید</h1>

      <div className="grid gap-3">
        {items.map((it) => (
          <div
            key={it.productId}
            className="border rounded-2xl p-4 flex items-center gap-4"
          >
            {it.coverUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={it.coverUrl}
                alt={it.name}
                className="w-16 h-16 object-cover rounded-xl border"
              />
            )}

            <div className="flex-1">
              <div className="font-semibold">{it.name}</div>
              {typeof it.price === "number" && (
                <div className="text-sm text-slate-600">
                  {it.price.toLocaleString()} تومان
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                className="px-3 py-1 rounded-xl border"
                onClick={() =>
                  dispatch(
                    setQty({
                      productId: it.productId,
                      qty: Math.max(1, it.qty - 1),
                    }),
                  )
                }
                aria-label="کاهش تعداد"
              >
                −
              </button>

              <input
                className="w-16 text-center border rounded-xl py-1"
                type="number"
                min={1}
                value={it.qty}
                onChange={(e) =>
                  dispatch(
                    setQty({
                      productId: it.productId,
                      qty: Math.max(1, Number(e.target.value) || 1),
                    }),
                  )
                }
                aria-label="تعداد"
              />

              <button
                className="px-3 py-1 rounded-xl border"
                onClick={() =>
                  dispatch(setQty({ productId: it.productId, qty: it.qty + 1 }))
                }
                aria-label="افزایش تعداد"
              >
                +
              </button>
            </div>

            <button
              className="rounded-xl border px-3 py-2"
              onClick={() => dispatch(removeItem({ productId: it.productId }))}
            >
              حذف
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="font-semibold">جمع: {total.toLocaleString()} تومان</div>
        <button
          onClick={goCheckout}
          className="rounded-2xl bg-black text-white px-6 py-3"
        >
          ادامه و ثبت نهایی
        </button>
      </div>
    </div>
  );
}
