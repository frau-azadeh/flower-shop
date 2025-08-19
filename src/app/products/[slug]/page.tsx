import { notFound } from "next/navigation";
import { supabasePublic } from "@/lib/supabasePublic";
import type { PublicProduct } from "@/types/product";
import { toman } from "@/lib/format";
import ShareBox from "@/app/products/[slug]/ShareBox";
import ProductCard from "../ProductCard";

export const revalidate = 60;

type PageProps = { params: Promise<{ slug: string }> };

// انتخاب تصادفی N آیتم از یک آرایه (بدون any)
function pickRandom<T>(arr: T[], n: number): T[] {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const sb = supabasePublic();

  // محصول اصلی
  const { data, error } = await sb
    .from("products")
    .select(
      "id, name, slug, price, salePrice, category, coverUrl, description, createdAt",
    )
    .eq("active", true)
    .eq("slug", slug)
    .single();

  if (error || !data) return notFound();

  const p = data as PublicProduct;

  // محصولات همان دسته (چندتا می‌گیریم، بعداً 3 تا تصادفی انتخاب می‌کنیم)
  const { data: sameCat } = await sb
    .from("products")
    .select("id, name, slug, price, salePrice, category, coverUrl, createdAt")
    .eq("active", true)
    .eq("category", p.category)
    .neq("id", p.id)
    .order("createdAt", { ascending: false })
    .limit(12);

  const related = pickRandom((sameCat ?? []) as PublicProduct[], 3);

  // URL برای ShareBox
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const productUrl = `${base}/products/${p.slug}`;

  return (
    <main dir="rtl" className="mx-auto max-w-6xl p-4">
      {/* دسکتاپ: چپ 380px (عکس/اشتراک/مرتبط) | راست 1fr (متن) */}
      <div className="grid gap-6 md:grid-cols-[500px_1fr] md:auto-rows-min">
        {/* ستون چپ (دسکتاپ): عکس + ShareBox (استیکی) */}
        <aside className="order-1 md:order-1 md:col-start-1 md:row-start-1">
          <div className="md:sticky md:top-24">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.coverUrl ?? "/placeholder.png"}
              alt={p.name}
              className="w-full rounded-2xl border object-cover"
            />
            <ShareBox title={p.name} url={productUrl} />
          </div>
        </aside>

        {/* ستون راست (دسکتاپ): متن با اسکرول داخلی */}
        {/* ستون راست (دسکتاپ): متن با اسکرول داخلی و sticky */}
        <section className="order-2 md:order-2 md:col-start-2 md:row-start-1">
          {/* چسباندن به بالای ویوپورت؛ مقدار top را با ارتفاع هدرت هماهنگ کن */}
          <div className="md:sticky md:top-24">
            <div
              className="rounded-2xl border border-slate-200 bg-white p-4
                    md:max-h-[calc(100vh-8rem)] md:overflow-auto"
            >
              <h1 className="mb-2 text-xl font-bold">{p.name}</h1>
              <div className="mb-3 text-sm text-slate-500">{p.category}</div>

              <div className="mb-4">
                {p.salePrice ? (
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold">
                      {toman(p.salePrice)}
                    </span>
                    <span className="text-sm text-slate-400 line-through">
                      {toman(p.price)}
                    </span>
                  </div>
                ) : (
                  <span className="text-lg font-bold">{toman(p.price)}</span>
                )}
              </div>

              <p className="whitespace-pre-line leading-7 text-slate-700">
                {p.description || "—"}
              </p>
            </div>
          </div>
        </section>

        {/* محصولات مرتبط: در دسکتاپ زیر ستون چپ قرار بگیرد؛ در موبایل آخر صفحه */}
        {related.length > 0 && (
          <section className="order-3 md:col-start-1 md:row-start-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <h2 className="mb-3 text-sm font-semibold text-slate-700">
                محصولات مرتبط
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {related.map((rp) => (
                  <ProductCard key={rp.id} product={rp} />
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
