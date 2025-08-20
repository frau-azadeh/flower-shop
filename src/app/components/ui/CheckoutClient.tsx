"use client";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store/store";
import { clearCart } from "@/store/orders/cartSlice";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutClient({
  defaultFullName = "",
  defaultPhone = "",
  defaultAddress = "",
}: {
  defaultFullName?: string;
  defaultPhone?: string;
  defaultAddress?: string;
}) {
  const items = useSelector((s: RootState) => Object.values(s.cart.items));
  const dispatch = useDispatch();
  const router = useRouter();

  const [fullName, setFullName] = useState(defaultFullName);
  const [phone, setPhone] = useState(defaultPhone);
  const [address, setAddress] = useState(defaultAddress);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const total = items.reduce((s, it) => s + (it.price ?? 0) * it.qty, 0);

  const submit = async () => {
    setMsg(null);
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          fullName,
          phone,
          address,
          note: note || undefined,
          items: items.map((it) => ({ productId: it.productId, qty: it.qty })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message ?? "خطا در ثبت سفارش");
      dispatch(clearCart());
      router.push("/account/orders"); // صفحه سفارش‌های من
    } catch (e) {
      setMsg((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0)
    return <div className="container mx-auto px-4 py-6">سبد شما خالی است.</div>;

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">تسویه و ثبت سفارش</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border p-4 space-y-3">
          <input
            className="border rounded-xl px-3 py-2"
            placeholder="نام و نام خانوادگی"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <input
            className="border rounded-xl px-3 py-2"
            placeholder="شماره تماس"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <textarea
            className="border rounded-xl px-3 py-2"
            placeholder="آدرس کامل"
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <textarea
            className="border rounded-xl px-3 py-2"
            placeholder="توضیحات (اختیاری)"
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          {msg && <p className="text-sm bg-gray-50 rounded-xl p-2">{msg}</p>}
          <button
            onClick={submit}
            disabled={loading || !fullName || !phone || !address}
            className="rounded-2xl bg-black text-white py-3 disabled:opacity-50"
          >
            {loading ? "در حال ثبت..." : "ثبت سفارش"}
          </button>
        </div>

        <div className="rounded-2xl border p-4">
          <h2 className="font-semibold mb-3">خلاصه سبد</h2>
          <ul className="space-y-2">
            {items.map((it) => (
              <li
                key={it.productId}
                className="flex items-center justify-between"
              >
                <span>
                  {it.name} × {it.qty}
                </span>
                <span>{((it.price ?? 0) * it.qty).toLocaleString()} تومان</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 font-bold">
            جمع: {total.toLocaleString()} تومان
          </div>
        </div>
      </div>
    </div>
  );
}
