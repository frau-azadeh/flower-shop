// app/api/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

// === تنظیمات
const SHIPPING_FEE = Number(process.env.NEXT_PUBLIC_SHIPPING_FEE ?? "0");

// === Schemas
const MakeOrderItem = z.object({
  productId: z.string().uuid(),
  qty: z.number().int().min(1),
});
const makeOrderSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(5),
  address: z.string().min(5),
  note: z.string().optional().nullable(),
  items: z.array(MakeOrderItem).min(1),
});

const ProductDb = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  price: z.number(),
  salePrice: z.number().nullable(),
  stock: z.number().int(),
  coverUrl: z.string().nullable().optional(),
  category: z.string(),
  active: z.boolean(),
});

// =====================================================
// GET: سفارش‌های کاربر + آیتم‌ها
// =====================================================
export async function GET() {
  try {
    const sb = await supabaseServer();
    const { data: u } = await sb.auth.getUser();
    const userId = u.user?.id;
    if (!userId) {
      return NextResponse.json(
        { ok: false, message: "UNAUTHORIZED" },
        { status: 401 },
      );
    }

    const { data, error } = await sb
      .from("orders")
      .select(
        `
        id, userId, status, fullName, phone, address, note,
        subTotal, shippingFee, grandTotal, createdAt,
        items:orderItems ( productName, qty, unitPrice, lineTotal )
      `,
      )
      .eq("userId", userId)
      .order("createdAt", { ascending: false });

    if (error) {
      return NextResponse.json(
        { ok: false, message: error.message },
        { status: 500 },
      );
    }
    return NextResponse.json(
      { ok: true, orders: data ?? [] },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "INTERNAL_ERROR";
    return NextResponse.json({ ok: false, message: msg }, { status: 500 });
  }
}

// =====================================================
// POST: درج سفارش
// =====================================================
export async function POST(req: NextRequest) {
  try {
    console.log("[/api/orders] POST start");

    const sb = await supabaseServer();
    const { data: uRes } = await sb.auth.getUser();
    const userId = uRes.user?.id;
    if (!userId) {
      console.log("[/api/orders] no user");
      return NextResponse.json(
        { ok: false, message: "UNAUTHORIZED" },
        { status: 401 },
      );
    }

    const raw = await req.json();
    console.log("[/api/orders] body:", raw);
    const input = makeOrderSchema.parse(raw);

    const admin = supabaseAdmin();
    console.log("[/api/orders] reading products…");
    const { data: prodRaw, error: prodErr } = await admin
      .from("products")
      .select(
        "id, name, slug, price, salePrice, stock, coverUrl, category, active",
      )
      .in("id", Array.from(new Set(input.items.map((i) => i.productId))));

    if (prodErr) {
      console.error("[/api/orders] products error:", prodErr.message);
      return NextResponse.json(
        { ok: false, message: prodErr.message },
        { status: 500 },
      );
    }
    const products = z.array(ProductDb).parse(prodRaw ?? []);
    if (products.length !== input.items.length) {
      return NextResponse.json(
        { ok: false, message: "برخی محصولات یافت نشد." },
        { status: 400 },
      );
    }

    // خطوط و کنترل موجودی
    type Line = {
      productId: string;
      qty: number;
      productName: string;
      productSlug: string;
      productCategory: string;
      unitPrice: number;
      lineTotal: number;
      stockBefore: number;
    };
    const lines: Line[] = [];
    let subTotal = 0;

    for (const it of input.items) {
      const p = products.find((pp) => pp.id === it.productId)!;
      if (!p.active) {
        return NextResponse.json(
          { ok: false, message: `محصول «${p.name}» غیرفعال است.` },
          { status: 400 },
        );
      }
      if (p.stock < it.qty) {
        return NextResponse.json(
          { ok: false, message: `موجودی «${p.name}» کافی نیست.` },
          { status: 400 },
        );
      }
      const unitPrice = p.salePrice ?? p.price;
      const lineTotal = unitPrice * it.qty;
      subTotal += lineTotal;

      lines.push({
        productId: p.id,
        qty: it.qty,
        productName: p.name,
        productSlug: p.slug,
        productCategory: p.category,
        unitPrice,
        lineTotal,
        stockBefore: p.stock,
      });
    }

    const grandTotal = subTotal + SHIPPING_FEE;

    console.log("[/api/orders] inserting order…");
    const { data: ordRow, error: ordErr } = await admin
      .from("orders")
      .insert([
        {
          userId,
          status: "pending",
          fullName: input.fullName,
          phone: input.phone,
          address: input.address,
          note: input.note ?? "",
          subTotal,
          shippingFee: SHIPPING_FEE,
          grandTotal,
        },
      ])
      .select("id")
      .single();

    if (ordErr || !ordRow) {
      console.error("[/api/orders] insert order error:", ordErr?.message);
      return NextResponse.json(
        { ok: false, message: ordErr?.message ?? "ثبت سفارش ناموفق بود" },
        { status: 500 },
      );
    }
    const orderId: string = ordRow.id;

    // اقلام
    const itemsRows = lines.map((li) => ({
      orderId,
      productId: li.productId,
      productName: li.productName,
      productSlug: li.productSlug,
      productCategory: li.productCategory,
      unitPrice: li.unitPrice,
      qty: li.qty,
      lineTotal: li.lineTotal,
    }));

    console.log("[/api/orders] inserting orderItems…");
    const { error: itemsErr } = await admin
      .from("orderItems")
      .insert(itemsRows);
    if (itemsErr) {
      console.error("[/api/orders] insert items error:", itemsErr.message);
      return NextResponse.json(
        { ok: false, message: itemsErr.message },
        { status: 500 },
      );
    }

    // کاهش موجودی
    for (const li of lines) {
      const newStock = li.stockBefore - li.qty;
      const { error: upErr } = await admin
        .from("products")
        .update({ stock: newStock })
        .eq("id", li.productId);
      if (upErr) {
        console.error("[/api/orders] update stock error:", upErr.message);
        return NextResponse.json(
          { ok: false, message: `خطا در بروزرسانی موجودی «${li.productName}»` },
          { status: 500 },
        );
      }
    }

    console.log("[/api/orders] success:", orderId);
    return NextResponse.json({ ok: true, orderId }, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "BAD_REQUEST";
    console.error("[/api/orders] catch:", msg);
    const status = msg === "UNAUTHORIZED" ? 401 : 400;
    return NextResponse.json({ ok: false, message: msg }, { status });
  }
}
