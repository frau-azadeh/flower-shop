"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { toman } from "@/lib/format";

export type CartEntry = {
  productId: string;
  name: string;
  price: number | null;
  qty: number;
  coverUrl?: string | null;
  slug?: string;
};

type Props = {
  item: CartEntry;
  onDec: (id: string, currentQty: number) => void;
  onInc: (id: string, currentQty: number) => void;
  onInput: (id: string, value: string) => void;
  onRemove: (id: string) => void;
};

export default function CartItemCard({
  item,
  onDec,
  onInc,
  onInput,
  onRemove,
}: Props) {
  const unit = typeof item.price === "number" ? item.price : 0;
  const line = unit * item.qty;

  return (
    <div className="flex items-stretch gap-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm ring-1 ring-black/5">
      {/* تصویر */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.coverUrl ?? "/placeholder.png"}
        alt={item.name}
        className="h-20 w-20 rounded-xl border object-cover"
      />

      {/* عنوان و قیمت واحد */}
      <div className="min-w-0 flex-1">
        <div className="line-clamp-1 font-semibold text-slate-900">
          {item.name}
        </div>
        {typeof item.price === "number" && (
          <div className="mt-1 text-xs text-slate-500">
            قیمت واحد: {toman(unit)} تومان
          </div>
        )}

        {/* کنترل تعداد */}
        <div className="mt-3 inline-flex items-center rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => onDec(item.productId, item.qty)}
            className="grid size-9 place-items-center rounded-s-xl text-slate-700 hover:bg-slate-50"
            aria-label="کاهش تعداد"
          >
            <Minus className="size-4" />
          </button>
          <input
            className="w-14 border-x border-slate-200 py-1 text-center text-sm outline-none"
            type="number"
            min={1}
            value={item.qty}
            onChange={(e) => onInput(item.productId, e.target.value)}
            aria-label="تعداد"
          />
          <button
            type="button"
            onClick={() => onInc(item.productId, item.qty)}
            className="grid size-9 place-items-center rounded-e-xl text-slate-700 hover:bg-slate-50"
            aria-label="افزایش تعداد"
          >
            <Plus className="size-4" />
          </button>
        </div>
      </div>

      {/* جمع جزئی + حذف */}
      <div className="flex shrink-0 flex-col items-end justify-between">
        <div className="text-sm font-semibold text-slate-900">
          {toman(line)} <span className="text-xs text-slate-500">تومان</span>
        </div>
        <button
          type="button"
          onClick={() => onRemove(item.productId)}
          className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-2.5 py-1.5 text-xs text-rose-700 hover:bg-rose-50"
        >
          <Trash2 className="size-4" />
          حذف
        </button>
      </div>
    </div>
  );
}
