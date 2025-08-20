import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { makeOrderSchema } from "@/schemas/orderSchemas";
import type { MakeOrderInput, MakeOrderResponse } from "@/schemas/orderSchemas";
import type { OrderRow, ProductRow, OrderItemRow } from "@/types/order";

const SHIPPING_FEE = Number(process.env.NEXT_PUBLIC_SHIPPING_FEE ?? "0");

/** لیست سفارش‌های کاربر فعلی (RLS لازم است) */
export async function GET() {
  try {
    const sb = await supabaseServer();
    const { data: uRes } = await sb.auth.getUser();
    const userId = uRes.user?.id;
    if (!userId) {
      return NextResponse.json({ ok: false, message: "UNAUTHORIZED" }, { status: 401 });
    }

    const { data, error } = await sb
      .from("orders")
      .select("id, status, fullName, phone, address, note, subTotal, shippingFee, grandTotal, createdAt")
      .order("createdAt", { ascending: false });

    if (error) {
      return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
    }

    const orders: OrderRow[] = (data ?? []) as OrderRow[];
    return NextResponse.json({ ok: true, orders });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "INTERNAL_ERROR";
    return NextResponse.json({ ok: false, message: msg }, { status: 500 });
  }
}

/** ساخت سفارش */
export async function POST(req: NextRequest) {
  try {
    // 1) کاربر
    const sb = await supabaseServer();
    const { data: uRes } = await sb.auth.getUser();
    const userId = uRes.user?.id;
    if (!userId) {
      return NextResponse.json({ ok: false, message: "UNAUTHORIZED" }, { status: 401 });
    }

    // 2) ورودی
    const json = (await req.json()) as unknown;
    const input = makeOrderSchema.parse(json) as MakeOrderInput;

    // 3) محصولات (بدون RLS)
    const admin = supabaseAdmin();
    const productIds = [...new Set(input.items.map(i => i.productId))];

    const { data: prodData, error: prodErr } = await admin
      .from("products")
      .select("id, name, slug, price, salePrice, stock, coverUrl, category, active")
      .in("id", productIds);

    if (prodErr) {
      return NextResponse.json({ ok: false, message: prodErr.message }, { status: 500 });
    }

    const products: ProductRow[] = (prodData ?? []) as ProductRow[];
    if (products.length !== productIds.length) {
      return NextResponse.json({ ok: false, message: "بعضی محصولات یافت نشد." }, { status: 400 });
    }

    // 4) محاسبه و کنترل موجودی
    let subTotal = 0;

    const lineItems: {
      product: ProductRow;
      qty: number;
      unitPrice: number;
      lineTotal: number;
    }[] = input.items.map((it) => {
      const p = products.find(pp => pp.id === it.productId)!;

      if (!p.active) {
        throw new Error(`محصول «${p.name}» غیرفعال است.`);
      }
      if (p.stock < it.qty) {
        throw new Error(`موجودی «${p.name}» کافی نیست (درخواست ${it.qty}، موجود ${p.stock}).`);
      }

      const unitPrice = (p.salePrice ?? p.price);
      const lineTotal = unitPrice * it.qty;
      subTotal += lineTotal;

      return { product: p, qty: it.qty, unitPrice, lineTotal };
    });

    const grandTotal = subTotal + SHIPPING_FEE;

    // 5) درج order
    const { data: orderRow, error: orderErr } = await admin
      .from("orders")
      .insert([{
        userId,
        status: "pending",
        fullName: input.fullName,
        phone: input.phone,
        address: input.address,
        note: input.note ?? null,
        subTotal,
        shippingFee: SHIPPING_FEE,
        grandTotal,
      }])
      .select("id")
      .single();

    if (orderErr || !orderRow) {
      return NextResponse.json({ ok: false, message: orderErr?.message ?? "ثبت سفارش ناموفق بود" }, { status: 500 });
    }
    const orderId: string = orderRow.id;

    // 6) درج اقلام
    const itemsRows: Omit<OrderItemRow, "id" | "createdAt">[] = lineItems.map((li) => ({
      orderId,
      productId: li.product.id,
      qty: li.qty,
      unitPrice: li.unitPrice,
      lineTotal: li.lineTotal,
      productName: li.product.name,
      productSlug: li.product.slug,
      productCategory: li.product.category,
    }));

    const { error: itemsErr } = await admin.from("orderItems").insert(itemsRows);
    if (itemsErr) {
      return NextResponse.json({ ok: false, message: itemsErr.message }, { status: 500 });
    }

    // 7) کم کردن موجودی (ساده؛ برای تولید واقعی بهتر است RPC/transaction)
    for (const li of lineItems) {
      const newStock = li.product.stock - li.qty;
      const { error: upErr } = await admin
        .from("products")
        .update({ stock: newStock })
        .eq("id", li.product.id);

      if (upErr) {
        return NextResponse.json(
          { ok: false, message: `خطا در بروزرسانی موجودی «${li.product.name}»` },
          { status: 500 }
        );
      }
    }

    const res: MakeOrderResponse = { ok: true, orderId };
    return NextResponse.json(res, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "BAD_REQUEST";
    const status = msg === "UNAUTHORIZED" ? 401 : 400;
    return NextResponse.json({ ok: false, message: msg }, { status });
  }
}
