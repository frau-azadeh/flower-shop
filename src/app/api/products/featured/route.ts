import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";  // یا: export const revalidate = 0;

type Row = {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice: number | null;
  coverUrl: string | null;
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(Number(searchParams.get("limit") ?? "8"), 20);

    const { data, error } = await supabaseAdmin()
      .from("products")
      .select("id,name,slug,price,salePrice,coverUrl")
      .eq("active", true)
      .order("createdAt", { ascending: false })
      .limit(limit);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // خروجی سرراست: آرایه از محصولات
    const rows: Row[] = (data ?? []).map((r) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      price: r.price,
      salePrice: r.salePrice,
      coverUrl: r.coverUrl,
    }));

    return NextResponse.json(rows);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "INTERNAL_ERROR";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
