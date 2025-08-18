import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { getAdminOrThrow } from "@/lib/adminAuth";
import { deleteProductSchema } from "@/schemas/product.schema";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    await getAdminOrThrow(["FULL", "PRODUCTS"]);

    const body = await req.json();
    const input = deleteProductSchema.parse(body);
    if (!input.id && !input.slug) {
      return NextResponse.json(
        { ok: false, message: "id یا slug الزامی است" },
        { status: 400 },
      );
    }

    const sb = supabaseServer();
    const { error } = input.id
      ? await sb.from("products").delete().eq("id", input.id)
      : await sb.from("products").delete().eq("slug", input.slug!);

    if (error) {
      console.error("delete error:", error);
      return NextResponse.json(
        { ok: false, message: "حذف ناموفق بود" },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "BAD_REQUEST";
    const status =
      msg === "UNAUTHORIZED" ? 401 : msg === "FORBIDDEN" ? 403 : 400;
    return NextResponse.json({ ok: false, message: msg }, { status });
  }
}
