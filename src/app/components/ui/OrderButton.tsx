"use client";
import { useState } from "react";

type Props = {
  productId: string;
  productName: string;
};

export default function OrderButton({ productId, productName }: Props) {
  const [open, setOpen] = useState(false);
  const [qty, setQty] = useState(1);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

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
          items: [{ productId, qty }],
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message ?? "خطا در ثبت سفارش");
      setMsg(`سفارش با موفقیت ثبت شد. کد: ${data.orderId}`);
      // در صورت نیاز می‌توانی اینجا فرم را ریست کنی
      // setOpen(false)
    } catch (e) {
      setMsg((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const disabled =
    loading || !fullName.trim() || !phone.trim() || !address.trim() || qty < 1;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-2xl bg-black text-white py-3"
      >
        ثبت سفارش {productName}
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          aria-modal="true"
          role="dialog"
        >
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 w-full max-w-md rounded-2xl border bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-semibold">ثبت سفارش</h3>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-1 text-slate-500 hover:bg-slate-100"
                aria-label="بستن"
              >
                ✕
              </button>
            </div>

            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <label className="text-sm">تعداد</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="px-3 py-1 rounded-xl border hover:bg-gray-50"
                    aria-label="کاهش"
                  >
                    −
                  </button>
                  <input
                    className="w-16 text-center border rounded-xl py-1"
                    type="number"
                    min={1}
                    value={qty}
                    onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
                  />
                  <button
                    type="button"
                    onClick={() => setQty((q) => q + 1)}
                    className="px-3 py-1 rounded-xl border hover:bg-gray-50"
                    aria-label="افزایش"
                  >
                    +
                  </button>
                </div>
              </div>

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
            </div>

            {msg && (
              <p className="mt-3 rounded-xl bg-gray-50 p-2 text-center text-sm text-gray-700">
                {msg}
              </p>
            )}

            <div className="mt-4 flex gap-2">
              <button
                onClick={submit}
                disabled={disabled}
                className="flex-1 rounded-2xl bg-black py-3 text-white disabled:opacity-50"
              >
                {loading ? "در حال ثبت..." : "ثبت سفارش"}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="flex-1 rounded-2xl border py-3"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
