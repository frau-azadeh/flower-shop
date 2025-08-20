"use client";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store/store";
import { removeItem, setQty } from "@/store/orders/cartSlice";
import Link from "next/link";

export default function CartPage() {
  const items = useSelector((s: RootState) => Object.values(s.cart.items));
  const dispatch = useDispatch();
  const total = items.reduce((s, it) => s + (it.price ?? 0) * it.qty, 0);

  if (items.length === 0)
    return <div className="container mx-auto px-4 py-6">سبد شما خالی است.</div>;

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
                  dispatch(setQty({ productId: it.productId, qty: it.qty - 1 }))
                }
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
              />
              <button
                className="px-3 py-1 rounded-xl border"
                onClick={() =>
                  dispatch(setQty({ productId: it.productId, qty: it.qty + 1 }))
                }
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
        <Link
          href="/user/dashboard?checkout=1"
          className="rounded-2xl bg-black text-white px-6 py-3"
        >
          ادامه و ثبت نهایی
        </Link>
      </div>
    </div>
  );
}
