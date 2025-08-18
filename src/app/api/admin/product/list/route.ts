import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { getAdminOrThrow } from "@/lib/adminAuth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    await getAdminOrThrow(["FULL", "PRODUCTS"]);

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(
      50,
      Math.max(1, Number(searchParams.get("limit") || 20)),
    );
    const q = (searchParams.get("q") || "").trim();
    const includeInactive =
      (searchParams.get("includeInactive") || "true") === "true";

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const sb = supabaseServer();

    let query = sb
      .from("products")
      .select(
        "id, name, slug, price, salePrice, category, stock, active, coverUrl, createdAt, description",
        { count: "exact" },
      )
      .order("createdAt", { ascending: false })
      .range(from, to);

    if (!includeInactive) query = query.eq("active", true);
    if (q) {
      // جستجو روی name/slug/category
      query = query.or(
        `name.ilike.%${q}%,slug.ilike.%${q}%,category.ilike.%${q}%`,
      );
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("list error:", error);
      return NextResponse.json(
        { ok: false, message: "خطا در دریافت لیست" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ok: true,
      items: data ?? [],
      page,
      pageSize: limit,
      total: count ?? 0,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "BAD_REQUEST";
    const status =
      msg === "UNAUTHORIZED" ? 401 : msg === "FORBIDDEN" ? 403 : 400;
    return NextResponse.json({ ok: false, message: msg }, { status });
  }
}
