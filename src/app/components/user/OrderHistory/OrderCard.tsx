"use client";

import Link from "next/link";
import type { OrderRow } from "@/types/OrderHistory/types";
import { norm, rial } from "./utils";

type Props = {
  order: OrderRow;
  profileIncomplete: boolean;
  onCancel: (id: string) => void;
  onPay: (id: string) => void;
};

export default function OrderCard({
  order: o,
  profileIncomplete,
  onCancel,
  onPay,
}: Props) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-slate-50">
      <header className="flex flex-col gap-2 border-b border-slate-200 px-4 py-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`text-xs rounded-full px-2 py-0.5 border ${
              norm(o.status) === "pending"
                ? "border-yellow-300 text-yellow-700 bg-yellow-50"
                : norm(o.status) === "paid"
                  ? "border-emerald-300 text-emerald-700 bg-emerald-50"
                  : norm(o.status) === "sent"
                    ? "border-blue-300 text-blue-700 bg-blue-50"
                    : norm(o.status) === "canceled" ||
                        norm(o.status) === "cancelled"
                      ? "border-rose-300 text-rose-700 bg-rose-50"
                      : "border-slate-300 text-slate-600 bg-white"
            }`}
          >
            {o.status}
          </span>
          <time className="text-xs text-slate-500">
            {new Date(o.createdAt).toLocaleString("fa-IR")}
          </time>
        </div>
        <div className="text-xs text-slate-600">
          <span className="font-semibold">کد سفارش: </span>
          {o.id}
        </div>
      </header>

      <div className="px-4 py-3">
        <h4 className="mb-2 font-semibold text-slate-700">اقلام سفارش</h4>
        {o.items.length === 0 ? (
          <div className="rounded-xl bg-white px-3 py-2 text-sm text-slate-500">
            قلمی ثبت نشده است.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-500">
                  <th className="px-3 py-2 text-right font-medium">نام کالا</th>
                  <th className="px-3 py-2 text-center font-medium">تعداد</th>
                  <th className="px-3 py-2 text-left font-medium">قیمت واحد</th>
                  <th className="px-3 py-2 text-left font-medium">مبلغ</th>
                </tr>
              </thead>
              <tbody>
                {o.items.map((it, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-3 py-2">{it.productName}</td>
                    <td className="px-3 py-2 text-center">× {it.qty}</td>
                    <td className="px-3 py-2">{rial(it.unitPrice)}</td>
                    <td className="px-3 py-2 font-medium">
                      {rial(it.lineTotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <footer className="grid gap-4 px-4 pb-4 md:grid-cols-[1fr_auto] md:items-end">
        <div className="text-sm leading-7">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">جمع جزء</span>
            <span className="font-medium">{rial(o.subTotal)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">هزینه ارسال</span>
            <span className="font-medium">{rial(o.shippingFee)}</span>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 md:flex-col">
          {profileIncomplete && (
            <Link
              href="/user/address?address=new"
              className="inline-flex items-center justify-center rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-700 hover:bg-amber-100"
            >
              ثبت اطلاعات
            </Link>
          )}
          {(norm(o.status) === "pending" || norm(o.status) === "paid") && (
            <button
              onClick={() => onCancel(o.id)}
              className="inline-flex items-center justify-center rounded-xl bg-rose-600 px-4 py-2 text-sm text-white hover:bg-rose-700"
            >
              لغو سفارش
            </button>
          )}
          {norm(o.status) === "pending" && (
            <button
              onClick={() => onPay(o.id)}
              className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm text-white hover:opacity-90"
            >
              تایید پرداخت
            </button>
          )}
        </div>
      </footer>
    </article>
  );
}
