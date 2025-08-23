import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireUser } from "../../_utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: NextRequest) {
  // احراز هویت بر اساس کوکی
  const gate = await requireUser();
  if (!gate.ok) return gate.res;

  const form = await req.formData();

  const id = String(form.get("id") ?? "");
  const name = String(form.get("name") ?? "").trim();
  const slug = String(form.get("slug") ?? "").trim();
  const category = String(form.get("category") ?? "").trim();
  const description = String(form.get("description") ?? "");
  const price = Number(form.get("price") ?? 0);
  const saleRaw = form.get("salePrice");
  const salePrice = saleRaw === "" || saleRaw == null ? null : Number(saleRaw);
  const stock = Number(form.get("stock") ?? 0);
  const active = String(form.get("active") ?? "true") === "true";
  const cover = form.get("cover") as File | null;

  if (!id || !name || !slug || !category) {
    return NextResponse.json({ ok: false, message: "ورودی نامعتبر" }, { status: 400 });
  }

  const admin = supabaseAdmin();

  // اگر فایل کاور آمده، آپلود کن (اختیاری)
  let coverUrl: string | undefined;
  if (cover && cover.size > 0) {
    const arrayBuf = await cover.arrayBuffer();
    const buffer = Buffer.from(arrayBuf);
    const ext = cover.type.split("/")[1] || "jpg";
    const path = `covers/${id}.${ext}`;

    const up = await admin.storage.from("product-covers").upload(path, buffer, {
      upsert: true,
      contentType: cover.type || "image/jpeg",
    });
    if (up.error) {
      return NextResponse.json({ ok: false, message: up.error.message }, { status: 500 });
    }
    coverUrl = admin.storage.from("product-covers").getPublicUrl(path).data.publicUrl;
  }

  const update: {
    name: string;
    slug: string;
    category: string;
    description: string | null;
    price: number;
    salePrice: number | null;
    stock: number;
    active: boolean;
    coverUrl?: string;
  } = {
    name,
    slug,
    category,
    description: description || null,
    price,
    salePrice,
    stock,
    active,
  };
  if (coverUrl) update.coverUrl = coverUrl;

  const { error } = await admin.from("products").update(update).eq("id", id);
  if (error) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
