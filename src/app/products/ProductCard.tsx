"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Info, Heart } from "lucide-react";
import { computePrice, rial } from "@/lib/price";

export type Product = {
  id: string;
  name: string;
  slug: string;
  price: number | `${number}`;
  salePrice?: number | `${number}` | null;
  coverUrl?: string | null;
};

type Props = {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onToggleFavorite?: (id: string, next: boolean) => void;
  initialFavorite?: boolean;
};

export default function ProductCard({
  product,
  onAddToCart,
  onToggleFavorite,
  initialFavorite = false,
}: Props) {
  const { base, current, hasSale, offPercent } = computePrice(
    product.price,
    product.salePrice,
  );

  // اگر قیمت نامعتبر بود، کارت را رندر نکن (یا می‌توان پیام دلخواه گذاشت)
  const hasValidPrice = Number.isFinite(current) && current > 0;

  const [fav, setFav] = useState(initialFavorite);
  const toggleFav = () => {
    const next = !fav;
    setFav(next);
    onToggleFavorite?.(product.id, next);
  };

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-border/60 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg">
      {/* تصویر */}
      <div className="relative">
        <Link href={`/products/${product.slug}`} className="block">
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={product.name}
              src={
                product.coverUrl ??
                "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 900'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' x2='1' y1='0' y2='1'%3E%3Cstop stop-color='%23f1f5f9'/%3E%3Cstop stop-color='%23e2e8f0' offset='1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23g)' width='1200' height='900'/%3E%3C/svg%3E"
              }
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?q=80&w=1600&auto=format&fit=crop";
              }}
            />

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </Link>

        {/* نشان تخفیف */}
        {hasSale && (
          <span className="absolute top-3 right-3 rounded-full bg-rose-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow ring-1 ring-white/30">
            ٪{offPercent} تخفیف
          </span>
        )}

        {/* قلب */}
        <button
          type="button"
          onClick={toggleFav}
          aria-pressed={fav}
          className="absolute top-3 left-3 grid place-items-center rounded-full bg-white/90 p-2 text-rose-600 shadow ring-1 ring-black/5 hover:bg-white"
        >
          <Heart
            className={`size-4 ${fav ? "fill-current" : ""}`}
            strokeWidth={1.8}
          />
        </button>
      </div>

      {/* بدنه */}
      <div className="p-4">
        <Link href={`/products/${product.slug}`} className="block">
          <h3
            className="line-clamp-1 font-bold text-slate-800 transition-colors group-hover:text-emerald-700"
            title={product.name}
          >
            {product.name}
          </h3>
        </Link>

        {/* قیمت‌ها — بدون «تماس بگیرید» */}
        {hasValidPrice && (
          <div className="mt-1 flex items-baseline gap-2">
            {hasSale && (
              <span className="text-sm text-slate-400 line-through">
                {rial(base)}
              </span>
            )}
            <span className="text-emerald-700 font-extrabold tracking-tighter">
              {rial(current)}
            </span>
            <span className="text-slate-500 text-sm">تومان</span>
          </div>
        )}

        <div className="mt-3 flex items-center justify-between">
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            <Info className="size-4" />
            جزئیات
          </Link>

          <button
            type="button"
            onClick={() => onAddToCart?.(product)}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            <ShoppingCart className="size-4" />
            افزودن به سبد
          </button>
        </div>
      </div>
    </article>
  );
}
