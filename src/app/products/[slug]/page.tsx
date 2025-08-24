// app/products/[slug]/page.tsx
import { notFound } from "next/navigation";
import { supabasePublic } from "@/lib/supabasePublic";
import type { PublicProduct } from "@/types/product";
import { toman } from "@/lib/format";

import ShareBox from "@/app/products/[slug]/ShareBox";
import ProductCard from "../ProductCard";
import AddToCartBar from "@/app/components/user/AddToCartBar";
import {
  Minus,
  Plus,

  Truck,
  ShieldCheck,
  Headphones,
} from "lucide-react";
export const revalidate = 60;

type PageProps = { params: Promise<{ slug: string }> };

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const sb = supabasePublic();

  // محصول اصلی
  const { data: product } = await sb
    .from("products")
    .select(
      "id, name, slug, price, salePrice, category, coverUrl, description, createdAt",
    )
    .eq("active", true)
    .eq("slug", slug)
    .maybeSingle<PublicProduct>();

  if (!product) return notFound();

  // محصولات همان دسته (غیر از فعلی)
  const { data: sameCat } = await sb
    .from("products")
    .select("id, name, slug, price, salePrice, category, coverUrl, createdAt")
    .eq("active", true)
    .eq("category", product.category)
    .neq("id", product.id)
    .order("createdAt", { ascending: false })
    .limit(12)
    .returns<PublicProduct[]>();

  // انتخاب خیلی ساده: ۳ مورد اول (بدون تابع جدا)
  // اگر خواستی تصادفی ولی ساده: بجای خط زیر از sort(() => Math.random() - 0.5).slice(0,3) استفاده کن
  const related: PublicProduct[] = (sameCat ?? []).slice(0, 2);

  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const productUrl = `${base}/products/${product.slug}`;

  return (
    <div className="bg-background">
      <main dir="rtl" className="mx-auto max-w-6xl p-4 ">
      {/* دسکتاپ: چپ 500px (عکس/اشتراک) | راست 1fr (متن) */}
      <div className="grid gap-6 md:grid-cols-[500px_1fr] md:auto-rows-min">
        {/* ستون چپ: عکس + ShareBox (استیکی) */}
        <aside className="order-1 md:order-1 md:col-start-1 md:row-start-1">
          <div className="md:sticky md:top-24">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.coverUrl ?? "/placeholder.png"}
              alt={product.name}
              className="w-full rounded-2xl border object-cover"
            />
            <ShareBox title={product.name} url={productUrl} />
          </div>
        </aside>

        {/* ستون راست: با اسکرول داخلی + sticky */}
        <section className="order-2 md:order-2 md:col-start-2 md:row-start-1">
          <div className="md:sticky md:top-24">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 md:max-h-[calc(100vh-8rem)] md:overflow-auto">
              <h1 className="mb-2 text-xl font-bold">{product.name}</h1>
              <div className="mb-3 text-sm text-slate-500">
                {product.category}
              </div>

              {/* بلوک قیمت (اینلاین و ساده) */}
              <div className="mb-4">
                {product.salePrice ? (
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold">
                      {toman(product.salePrice)}
                    </span>
                    <span className="text-sm text-slate-400 line-through">
                      {toman(product.price)}
                    </span>
                  </div>
                ) : (
                  <span className="text-lg font-bold">
                    {toman(product.price)}
                  </span>
                )}
              </div>

                {/* مزایا (چیپ) */}
                <ul className="mt-4 flex flex-wrap gap-2 text-[13px]">
                  <li className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-1.5 text-emerald-800 ring-1 ring-emerald-200">
                    <Truck className="size-4" />
                    ارسال رایگان
                  </li>
                  <li className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-1.5 text-emerald-800 ring-1 ring-emerald-200">
                    <ShieldCheck className="size-4" />
                    ضمانت کیفیت
                  </li>
                  <li className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-1.5 text-emerald-800 ring-1 ring-emerald-200">
                    <Headphones className="size-4" />
                    پشتیبانی ۲۴/۷
                  </li>
                </ul>

                {/* نوار خرید (خودت قبلاً سبزش کردی) */}
                <div className="mt-4">
                  <AddToCartBar
                    productId={product.id}
                    productName={product.name}
                    price={product.salePrice ?? product.price}
                    coverUrl={product.coverUrl ?? undefined}
                    slug={product.slug}
                  />
                </div>

                {/* توضیحات */}
                <div className="mt-6">
                  <p className="whitespace-pre-line leading-8 text-slate-700">
                    {product.description || "—"}
                  </p>
                </div>
              </div>
            </div>
          </section>

        {/* محصولات مرتبط (اینلاین و ساده) */}
        {related.length > 0 && (
          <section className="order-2 md:col-start-1 md:row-start-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <h2 className="mb-3 text-sm font-semibold text-slate-700">
                محصولات مرتبط
              </h2>
              <div className="grid grid-cols-2 gap-4 ">
                {related.map((rp) => (
                  <ProductCard key={rp.id} product={rp} />
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
    </div>
    
  );
}