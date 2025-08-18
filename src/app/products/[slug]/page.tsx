// src/app/products/[slug]/page.tsx
import { notFound } from "next/navigation";
import { supabasePublic } from "@/lib/supabasePublic";
import type { PublicProduct } from "@/types/product";
import { toman } from "@/lib/format";

export const revalidate = 60;

type PageProps = { params: Promise<{ slug: string }> };

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params; // ⬅️ در Next 15 باید await شود

  const sb = supabasePublic();
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

  return (
    <main dir="rtl" className="mx-auto max-w-5xl p-4">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_1.2fr]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={p.coverUrl ?? "/placeholder.png"}
          alt={p.name}
          className="w-full rounded-2xl border object-cover"
        />
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <h1 className="mb-2 text-xl font-bold">{p.name}</h1>
          <div className="mb-3 text-sm text-slate-500">{p.category}</div>
          <div className="mb-4">
            {p.salePrice ? (
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold">{toman(p.salePrice)}</span>
                <span className="text-sm text-slate-400 line-through">
                  {toman(p.price)}
                </span>
              </div>
            ) : (
              <span className="text-lg font-bold">{toman(p.price)}</span>
            )}
          </div>
          <p className="leading-7 text-slate-700 whitespace-pre-line">
            {p.description || "—"}
          </p>
        </div>
      </div>
    </main>
  );
}
