"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addItem } from "@/store/orders/cartSlice";

type Props = {
  productId: string;
  productName: string;
  price?: number;
  coverUrl?: string;
  slug?: string;
  maxQty?: number; // اختیاری (مثلا stock)
};

export default function AddToCartBar({
  productId, productName, price, coverUrl, slug, maxQty,
}: Props) {
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const dispatch = useDispatch();

  const clamp = (n: number) =>
    Math.max(1, typeof maxQty === "number" ? Math.min(maxQty, n) : n);

  const onAdd = () => {
    setAdding(true);
    try {
      dispatch(addItem({ productId, name: productName, qty, price, coverUrl, slug }));
      setMsg("به سبد اضافه شد.");
    } finally {
      setAdding(false);
      setTimeout(() => setMsg(null), 1500);
    }
  };

  return (
    <div className="mb-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setQty(q => clamp(q - 1))}
            className="px-3 py-1 rounded-xl border hover:bg-gray-50" aria-label="کاهش">−</button>
          <input className="w-16 text-center border rounded-xl py-1" type="number" min={1}
            value={qty} onChange={e => setQty(clamp(Number(e.target.value) || 1))} />
          <button type="button" onClick={() => setQty(q => clamp(q + 1))}
            className="px-3 py-1 rounded-xl border hover:bg-gray-50" aria-label="افزایش">+</button>
        </div>

        <button onClick={onAdd} disabled={adding || qty < 1}
          className="flex-1 rounded-2xl bg-black text-white py-3 disabled:opacity-50">
          {adding ? "در حال افزودن..." : "افزودن به سبد"}
        </button>
      </div>

      {msg && <p className="mt-2 text-center text-sm text-gray-700 bg-gray-50 rounded-xl p-2">{msg}</p>}
    </div>
  );
}
