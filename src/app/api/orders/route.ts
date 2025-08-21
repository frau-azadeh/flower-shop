// app/api/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { makeOrderSchema } from "@/schemas/orderSchemas";
import type { MakeOrderInput, MakeOrderResponse } from "@/schemas/orderSchemas";

export const dynamic = "force-dynamic";
export const runtime = "nodejs"; // مهم

const SHIPPING_FEE = Number(process.env.NEXT_PUBLIC_SHIPPING_FEE ?? "0");

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

const OrderItemDb = z.object({
  orderId: z.string().uuid(),
  productId: z.string().uuid(),
  productName: z.string(),
  productSlug: z.string().optional().nullable(),
  productCategory: z.string().optional().nullable(),
  unitPrice: z.number(),
  qty: z.number().int(),
  lineTotal: z.number(),
  createdAt: z.string().optional(),
});

const OrderDb = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  status: z.enum(["pending", "paid", "sent", "canceled"]),
  fullName: z.string(),
  phone: z.string(),
  address: z.string(),
  note: z.string().nullable().optional(),
  subTotal: z.number(),
  shippingFee: z.number(),
  grandTotal: z.number(),
  createdAt: z.string(),
});

type ProductRow = z.infer<typeof ProductDb>;
type OrderItemRow = z.infer<typeof OrderItemDb>;
type OrderRow = z.infer<typeof OrderDb> & {
  items: Pick<
    OrderItemRow,
    "productName" | "qty" | "unitPrice" | "lineTotal"
  >[];
};

function noStore(init?: number) {
  return {
    status: init ?? 200,
    headers: { "Cache-Control": "no-store" } as Record<string, string>,
  };
}

// -------- GET
export async function GET(): Promise<NextResponse> {
  try {
    const sb = await supabaseServer();
    const { data: u } = await sb.auth.getUser();
    const userId = u.user?.id;
    if (!userId)
      return NextResponse.json(
        { ok: false, message: "UNAUTHORIZED" },
        noStore(401),
      );

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

    if (error)
      return NextResponse.json(
        { ok: false, message: error.message },
        noStore(500),
      );

    const orders: OrderRow[] = (data ?? []) as OrderRow[];
    return NextResponse.json({ ok: true, orders }, noStore());
  } catch (e) {
    const msg = e instanceof Error ? e.message : "INTERNAL_ERROR";
    return NextResponse.json({ ok: false, message: msg }, noStore(500));
  }
}

// -------- POST
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const sb = await supabaseServer();
    const { data: uRes } = await sb.auth.getUser();
    const userId = uRes.user?.id;
    if (!userId)
      return NextResponse.json(
        { ok: false, message: "UNAUTHORIZED" },
        noStore(401),
      );

    const bodyUnknown = await req.json();
    const input: MakeOrderInput = makeOrderSchema.parse(bodyUnknown);
    if (input.items.length === 0) {
      return NextResponse.json(
        { ok: false, message: "سبد خالی است." },
        noStore(400),
      );
    }

    const admin = supabaseAdmin();
    const productIds = Array.from(new Set(input.items.map((i) => i.productId)));

    const { data: prodRaw, error: prodErr } = await admin
      .from("products")
      .select(
        "id, name, slug, price, salePrice, stock, coverUrl, category, active",
      )
      .in("id", productIds);

    if (prodErr)
      return NextResponse.json(
        { ok: false, message: prodErr.message },
        noStore(500),
      );

    const products: ProductRow[] = z.array(ProductDb).parse(prodRaw ?? []);

    // اگر حتی یک آیتمِ ورودی محصول متناظر نداشته باشد، پیام واضح بده
    for (const it of input.items) {
      if (!products.find((p) => p.id === it.productId)) {
        return NextResponse.json(
          { ok: false, message: `محصولی با شناسه ${it.productId} یافت نشد.` },
          noStore(400),
        );
      }
    }

    let subTotal = 0;
    const lines = input.items.map((it) => {
      const p = products.find((pp) => pp.id === it.productId)!;
      if (!p.active) throw new Error(`محصول «${p.name}» غیرفعال است.`);
      if (p.stock < it.qty) throw new Error(`موجودی «${p.name}» کافی نیست.`);
      const unitPrice = p.salePrice ?? p.price;
      const lineTotal = unitPrice * it.qty;
      subTotal += lineTotal;
      return { product: p, qty: it.qty, unitPrice, lineTotal };
    });

    const grandTotal = subTotal + SHIPPING_FEE;

    const { data: ordRow, error: ordErr } = await admin
      .from("orders")
      .insert([
        {
          userId,
          status: "pending",
          fullName: input.fullName.trim(),
          phone: input.phone.trim(),
          address: input.address.trim(),
          note: input.note ?? "",
          subTotal,
          shippingFee: SHIPPING_FEE,
          grandTotal,
        },
      ])
      .select("id")
      .single();

    if (ordErr || !ordRow) {
      return NextResponse.json(
        { ok: false, message: ordErr?.message ?? "ثبت سفارش ناموفق بود" },
        noStore(500),
      );
    }

    const orderId = z.string().uuid().parse(ordRow.id);

    const itemsRows: OrderItemRow[] = lines.map((li) => ({
      orderId,
      productId: li.product.id,
      qty: li.qty,
      unitPrice: li.unitPrice,
      lineTotal: li.lineTotal,
      productName: li.product.name,
      productSlug: li.product.slug,
      productCategory: li.product.category,
    }));

    const { error: itemsErr } = await admin
      .from("orderItems")
      .insert(itemsRows);
    if (itemsErr)
      return NextResponse.json(
        { ok: false, message: itemsErr.message },
        noStore(500),
      );

    // کاهش موجودی
    for (const li of lines) {
      const { error: upErr } = await admin
        .from("products")
        .update({ stock: li.product.stock - li.qty })
        .eq("id", li.product.id);
      if (upErr)
        return NextResponse.json(
          { ok: false, message: upErr.message },
          noStore(500),
        );
    }

    const resBody: MakeOrderResponse = { ok: true, orderId };
    return NextResponse.json(resBody, {
      status: 201,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (e) {
    // پیام خطا را شفاف برگردان تا بفهمیم دقیقاً کجا می‌ترکه
    const msg = e instanceof Error ? e.message : "BAD_REQUEST";
    return NextResponse.json({ ok: false, message: msg }, noStore(400));
  }
}
