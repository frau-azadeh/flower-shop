// src/app/components/home/FeaturedProducts.tsx
import { headers } from "next/headers";
import Link from "next/link";
import { ChevronLeft, Tag } from "lucide-react";
import ProductCard, { type Product } from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";

/* ---------- helpers ---------- */

const isNumLike = (v: unknown) =>
  typeof v === "number" ||
  (typeof v === "string" && v.trim() !== "" && !Number.isNaN(Number(v)));

function toNum(v: number | `${number}` | null | undefined): number {
  if (typeof v === "number") return v;
  if (typeof v === "string") return Number(v);
  return 0;
}

/** type guard */
function isProduct(x: unknown): x is Product {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.name === "string" &&
    typeof o.slug === "string" &&
    isNumLike(o.price) &&
    ("salePrice" in o ? o.salePrice === null || isNumLike(o.salePrice) : true)
  );
}

function isDiscounted(p: Product): boolean {
  const price = toNum(p.price);
  const sale = toNum(p.salePrice ?? null);
  return price > 0 && sale > 0 && sale < price;
}

function discountPercent(p: Product): number {
  const price = toNum(p.price);
  const sale = toNum(p.salePrice ?? null);
  if (!(price > 0 && sale > 0 && sale < price)) return 0;
  return Math.round(((price - sale) / price) * 100);
}

async function getBaseUrl(): Promise<string> {
  const h = await headers(); // Next 15
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (!host) return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return `${proto}://${host}`;
}

async function loadProducts(): Promise<Product[]> {
  const base = await getBaseUrl();

  // کمی آیتم بیشتر می‌گیریم تا بعد از فیلتر تخفیف، 8 تا داشته باشیم
  const urls = [
    `${base}/api/products/featured?limit=24`,
    `${base}/api/products?limit=24`,
    `${base}/api/featured?limit=24`,
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) continue;

      const data: unknown = await res.json();
      const arrays = [
        data,
        (data as { items?: unknown }).items,
        (data as { products?: unknown }).products,
        (data as { rows?: unknown }).rows,
      ];
      for (const a of arrays) {
        if (Array.isArray(a) && a.every(isProduct)) return a as Product[];
      }
    } catch {
      /* try next */
    }
  }
  return [];
}

/* ---------- component ---------- */

export default async function FeaturedProducts() {
  const all = await loadProducts();

  // فقط تخفیف‌دارها، مرتب بر اساس بیشترین درصد تخفیف
  const discounted = all
    .filter(isDiscounted)
    .sort((a, b) => discountPercent(b) - discountPercent(a))
    .slice(0, 8);

  // اگر هیچ تخفیفی نبود، همون لیست معمولی (تا خالی نشه)
  const products = discounted.length ? discounted : all.slice(0, 8);
  const isSaleOnly = discounted.length > 0;

  return (
    <section dir="rtl" className="bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-primary">
              {isSaleOnly ? "فروش ویژه" : "پیشنهادهای ویژه"}
            </h2>
            {isSaleOnly && (
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-1 text-[12px] font-semibold text-rose-600 ring-1 ring-rose-200">
                <Tag className="size-3.5" />
                فقط تخفیف‌دار
              </span>
            )}
            {!isSaleOnly && (
              <span className="text-xs text-slate-500">
                (فعلاً محصول تخفیف‌دار نداریم)
              </span>
            )}
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-1 rounded-xl border border-border bg-white px-3 py-2 text-sm font-semibold text-primary shadow-sm hover:bg-slate-50"
          >
            مشاهده همه
            <ChevronLeft className="size-4" />
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="grid gap-5 grid-cols-2 lg:grid-cols-4 ">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <ul className="grid gap-5 grid-cols-2 lg:grid-cols-4 ">
            {products.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
