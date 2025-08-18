// app/products/page.tsx
import { supabasePublic } from "@/lib/supabasePublic";
import ProductCard from "./ProductCard";
import type { PublicProduct } from "@/types/product";

export const revalidate = 60; // ISR یک دقیقه

type PageProps = {
  searchParams: Promise<{ q?: string; page?: string; category?: string }>;
};

export default async function ProductsPage({ searchParams }: PageProps) {
  const sp = await searchParams; // ⬅️ Next 15
  const q = (sp?.q ?? "").trim();
  const category = (sp?.category ?? "").trim();
  const page = Math.max(1, Number(sp?.page ?? "1"));

  const pageSize = 12;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const sb = supabasePublic();

  let query = sb
    .from("products")
    .select("id, name, slug, price, salePrice, category, coverUrl, createdAt", {
      count: "exact",
    })
    .eq("active", true)
    .order("createdAt", { ascending: false })
    .range(from, to);

  if (q) query = query.or(`name.ilike.%${q}%,slug.ilike.%${q}%,category.ilike.%${q}%`);
  if (category) query = query.eq("category", category);

  const { data, error, count } = await query;

  if (error) {
    return (
      <main dir="rtl" className="mx-auto max-w-6xl p-4">
        <h1 className="mb-4 text-lg font-bold">محصولات</h1>
        <p className="text-red-600">مشکلی در دریافت محصولات پیش آمد.</p>
      </main>
    );
  }

  const items = (data ?? []) as PublicProduct[];
  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const qs = (nextPage: number) => {
    const u = new URLSearchParams();
    if (q) u.set("q", q);
    if (category) u.set("category", category);
    u.set("page", String(nextPage));
    return u.toString();
  };

  return (
    <main dir="rtl" className="mx-auto max-w-6xl p-4">
      <h1 className="mb-4 text-lg font-bold">محصولات</h1>

      {/* نوار جستجو ساده */}
      <form className="mb-4 flex items-center gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="جستجو: نام / اسلاگ / دسته‌بندی"
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-accent"
        />
        <button className="rounded-xl bg-accent px-3 py-2 text-sm text-white">
          جستجو
        </button>
      </form>

      {/* گرید محصولات */}
      {items.length === 0 ? (
        <p className="text-slate-500">محصولی یافت نشد.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      {/* صفحه‌بندی ساده */}
      <div className="mt-6 flex items-center justify-between text-sm text-slate-600">
        <span>
          صفحه {page} از {totalPages}
        </span>
        <div className="flex items-center gap-2">
          <a
            href={`/products?${qs(Math.max(1, page - 1))}`}
            className={`rounded-lg border px-3 py-1.5 ${page <= 1 ? "pointer-events-none opacity-50" : ""}`}
          >
            قبلی
          </a>
          <a
            href={`/products?${qs(Math.min(totalPages, page + 1))}`}
            className={`rounded-lg border px-3 py-1.5 ${page >= totalPages ? "pointer-events-none opacity-50" : ""}`}
          >
            بعدی
          </a>
        </div>
      </div>
    </main>
  );
}
