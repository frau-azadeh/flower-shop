import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { getAdminOrThrow } from "@/lib/adminAuth";
import { parseUpdateProduct } from "@/schemas/product.schema";
import { uploadProductCover } from "@/lib/storage";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    await getAdminOrThrow(["FULL", "PRODUCTS"]);

    const form = await req.formData();
    const input = parseUpdateProduct(form);
    const coverFile = form.get("cover") as File | null;

    if (!input.id && !input.slug) {
      return NextResponse.json(
        { ok: false, message: "id یا slug الزامی است" },
        { status: 400 },
      );
    }

    const sb = supabaseServer();

    // پیدا کردن رکورد موجود
    const { data: found, error: findErr } = await sb
      .from("products")
      .select("id, slug")
      .match(input.id ? { id: input.id } : { slug: input.slug })
      .single();

    if (findErr || !found) {
      return NextResponse.json(
        { ok: false, message: "محصول یافت نشد" },
        { status: 404 },
      );
    }

    // اگر newSlug آمد، یکتا بودنش را چک کن
    if (input.newSlug && input.newSlug !== found.slug) {
      const { data: ex } = await sb
        .from("products")
        .select("id")
        .eq("slug", input.newSlug)
        .limit(1);
      if (ex && ex.length > 0) {
        return NextResponse.json(
          { ok: false, message: "اسلاگ جدید تکراری است" },
          { status: 400 },
        );
      }
    }

    // آپلود کاور جدید (اختیاری)
    let coverUrl: string | undefined = undefined;
    if (coverFile) {
      try {
        const finalSlug = input.newSlug ?? found.slug;
        coverUrl = await uploadProductCover(sb, coverFile, finalSlug);
      } catch (e) {
        console.error("upload error:", e);
        return NextResponse.json(
          { ok: false, message: "آپلود تصویر ناموفق بود" },
          { status: 500 },
        );
      }
    }

    // ساخت آبجکت آپدیت با نام ستون‌های camelCase
    const updateObj: Record<string, unknown> = {};
    if (input.name !== undefined) updateObj.name = input.name;
    if (input.newSlug !== undefined) updateObj.slug = input.newSlug;
    if (input.price !== undefined) updateObj.price = input.price;
    if (input.salePrice !== undefined) updateObj.salePrice = input.salePrice;
    if (input.category !== undefined) updateObj.category = input.category;
    if (input.stock !== undefined) updateObj.stock = input.stock;
    if (input.active !== undefined) updateObj.active = input.active;
    if (input.description !== undefined)
      updateObj.description = input.description;
    if (coverUrl !== undefined) updateObj.coverUrl = coverUrl;

    if (Object.keys(updateObj).length === 0) {
      return NextResponse.json({ ok: true }); // چیزی برای آپدیت نبود
    }

    const { error: upErr } = await sb
      .from("products")
      .update(updateObj)
      .eq("id", found.id);
    if (upErr) {
      console.error("update error:", upErr);
      return NextResponse.json(
        { ok: false, message: "به‌روزرسانی ناموفق بود" },
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
