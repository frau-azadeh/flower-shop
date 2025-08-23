import { NextRequest, NextResponse } from "next/server";
import { supabasePublic } from "@/lib/supabasePublic";

export const runtime = "nodejs";

type Item = {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice: number | null;
  category: string;
  coverUrl: string | null;
  createdAt: string;
};

type Ok = {
  ok: true;
  items: Item[];
  total: number;
  page: number;
  pageSize: number;
  categories: string[];
  price: { min: number | null; max: number | null };
};

type Bad = { ok: false; message: string };

export async function GET(req: NextRequest) {
  try {
    const sb = supabasePublic();
    const url = new URL(req.url);

    const q = (url.searchParams.get("q") || "").trim();
    const page = Math.max(1, Number(url.searchParams.get("page") || 1));
    const limit = Math.min(
      48,
      Math.max(1, Number(url.searchParams.get("limit") || 12)),
    );
    const catsFromRepeat = url.searchParams.getAll("category").filter(Boolean);
    const catsFromCsv = (url.searchParams.get("categories") || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const categoriesFilter = Array.from(
      new Set([...catsFromRepeat, ...catsFromCsv]),
    );
    const min = url.searchParams.get("min")
      ? Number(url.searchParams.get("min"))
      : undefined;
    const max = url.searchParams.get("max")
      ? Number(url.searchParams.get("max"))
      : undefined;

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = sb
      .from("products")
      .select(
        "id, name, slug, price, salePrice, category, coverUrl, createdAt",
        { count: "exact" },
      )
      .eq("active", true)
      .order("createdAt", { ascending: false })
      .range(from, to);

    if (q) {
      query = query.or(
        `name.ilike.%${q}%,slug.ilike.%${q}%,category.ilike.%${q}%`,
      );
    }
    if (categoriesFilter.length > 0) {
      query = query.in("category", categoriesFilter);
    }
    if (min != null || max != null) {
      const lo = min ?? 0;
      const hi = max ?? 9_000_000_000;
      // اگر تخفیف دارد، salePrice ملاک است؛ در غیر اینصورت price
      query = query.or(
        `and(salePrice.gte.${lo},salePrice.lte.${hi}),and(salePrice.is.null,price.gte.${lo},price.lte.${hi})`,
      );
    }

    const { data, error, count } = await query;
    if (error) throw error;

    // فهرست دسته‌ها برای سایدبار (distinct)
    const { data: catsRaw, error: catsErr } = await sb
      .from("products")
      .select("category")
      .eq("active", true);
    if (catsErr) throw catsErr;
    const categories = Array.from(
      new Set((catsRaw ?? []).map((r) => String(r.category)).filter(Boolean)),
    ).sort((a, b) => a.localeCompare(b, "fa"));

    // محاسبه حداقل/حداکثر قیمت: هم روی salePrice هم price
    const [{ data: minSale }, { data: minPrice }] = await Promise.all([
      sb
        .from("products")
        .select("salePrice")
        .eq("active", true)
        .not("salePrice", "is", null)
        .order("salePrice", { ascending: true })
        .limit(1)
        .maybeSingle(),
      sb
        .from("products")
        .select("price")
        .eq("active", true)
        .is("salePrice", null)
        .order("price", { ascending: true })
        .limit(1)
        .maybeSingle(),
    ]);
    const [{ data: maxSale }, { data: maxPrice }] = await Promise.all([
      sb
        .from("products")
        .select("salePrice")
        .eq("active", true)
        .not("salePrice", "is", null)
        .order("salePrice", { ascending: false })
        .limit(1)
        .maybeSingle(),
      sb
        .from("products")
        .select("price")
        .eq("active", true)
        .is("salePrice", null)
        .order("price", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

    const mins = [
      Number(minSale?.salePrice ?? NaN),
      Number(minPrice?.price ?? NaN),
    ].filter((n) => Number.isFinite(n) && n >= 0);
    const maxs = [
      Number(maxSale?.salePrice ?? NaN),
      Number(maxPrice?.price ?? NaN),
    ].filter((n) => Number.isFinite(n) && n >= 0);

    const body: Ok = {
      ok: true,
      items: (data ?? []) as Item[],
      total: count ?? 0,
      page,
      pageSize: limit,
      categories,
      price: {
        min: mins.length ? Math.min(...mins) : null,
        max: maxs.length ? Math.max(...maxs) : null,
      },
    };

    return NextResponse.json(body);
  } catch (e) {
    console.error("browse error:", e);
    const msg = e instanceof Error ? e.message : "SERVER_ERROR";
    const bad: Bad = { ok: false, message: msg };
    return NextResponse.json(bad, { status: 500 });
  }
}
