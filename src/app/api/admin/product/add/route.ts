// app/api/admin/product/add/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { getAdminOrThrow } from "@/lib/adminAuth";
import { parseCreateProduct } from "@/schemas/product.schema";
import { uploadProductCover } from "@/lib/storage";

// گزینه‌ای ولی مفید: اطمینان از Node runtime
export const runtime = "nodejs";

// فقط برای تست اینکه route دیده می‌شود
export function GET() {
  return NextResponse.json({ ok: true, route: "/api/admin/product/add" });
}

export async function POST(req: NextRequest) {
  try {
    // فقط FULL و PRODUCTS
    await getAdminOrThrow(["FULL", "PRODUCTS"]);

    const form = await req.formData();
    const input = parseCreateProduct(form);
    const coverFile = form.get("cover") as File | null;

    const sb = supabaseServer();

    // چک یکتایی اسلاگ
    {
      const { data: ex, error: exErr } = await sb
        .from("products")
        .select("id")
        .eq("slug", input.slug)
        .limit(1);

      if (exErr) {
        return NextResponse.json(
          { ok: false, message: "خطا در بررسی اسلاگ" },
          { status: 500 },
        );
      }
      if (ex && ex.length > 0) {
        return NextResponse.json(
          { ok: false, message: "اسلاگ تکراری است" },
          { status: 400 },
        );
      }
    }

    // آپلود کاور (اختیاری)
    let coverUrl: string | null = null;
    if (coverFile) {
      try {
        coverUrl = await uploadProductCover(sb, coverFile, input.slug);
      } catch {
        return NextResponse.json(
          { ok: false, message: "آپلود تصویر ناموفق بود" },
          { status: 500 },
        );
      }
    }

    // درج محصول
    const { data, error } = await sb
      .from("products")
      .insert({
        name: input.name,
        slug: input.slug,
        price: input.price,
        salePrice: input.salePrice ?? null,
        category: input.category,
        stock: input.stock,
        active: input.active,
        description: input.description ?? "",
        coverUrl,
      })
      .select("id, slug")
      .single();

    if (error) {
      return NextResponse.json(
        { ok: false, message: "ثبت محصول ناموفق بود" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { ok: true, id: data.id, slug: data.slug },
      { status: 201 },
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "BAD_REQUEST";
    const status =
      msg === "UNAUTHORIZED" ? 401 : msg === "FORBIDDEN" ? 403 : 400;
    return NextResponse.json({ ok: false, message: msg }, { status });
  }
}
