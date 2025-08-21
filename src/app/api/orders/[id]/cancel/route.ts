import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

type OrderMini = {
  id: string;
  userId: string;
  status: "pending" | "paid" | "sent" | "canceled";
};

type OrderItemMini = {
  productId: string;
  qty: number;
};

export async function POST(
  _: Request,
  { params }: { params: { id: string } }, // <-- inline type required
) {
  const sb = await supabaseServer();
  const admin = supabaseAdmin();

  // 1) auth
  const { data: uRes } = await sb.auth.getUser();
  const userId = uRes.user?.id;
  if (!userId) {
    return NextResponse.json(
      { ok: false, message: "UNAUTHORIZED" },
      { status: 401 },
    );
  }

  // 2) find order
  const { data: ordRaw, error: ordErr } = await sb
    .from("orders")
    .select("id, userId, status")
    .eq("id", params.id)
    .maybeSingle();

  if (ordErr) {
    return NextResponse.json(
      { ok: false, message: ordErr.message },
      { status: 500 },
    );
  }
  const order = (ordRaw ?? null) as OrderMini | null;
  if (!order || order.userId !== userId) {
    return NextResponse.json(
      { ok: false, message: "ORDER_NOT_FOUND" },
      { status: 404 },
    );
  }
  if (order.status !== "pending") {
    return NextResponse.json(
      { ok: false, message: "ONLY_PENDING_CAN_CANCEL" },
      { status: 400 },
    );
  }

  // 3) items
  const { data: itemsRaw, error: itemsErr } = await admin
    .from("orderItems")
    .select("productId, qty")
    .eq("orderId", params.id);

  if (itemsErr) {
    return NextResponse.json(
      { ok: false, message: itemsErr.message },
      { status: 500 },
    );
  }
  const items = (itemsRaw ?? []) as OrderItemMini[];

  // 4) mark order canceled
  const { error: upErr } = await admin
    .from("orders")
    .update({ status: "canceled" })
    .eq("id", params.id);
  if (upErr) {
    return NextResponse.json(
      { ok: false, message: upErr.message },
      { status: 500 },
    );
  }

  // 5) restock
  for (const it of items) {
    const { data: pRaw, error: pErr } = await admin
      .from("products")
      .select("stock")
      .eq("id", it.productId)
      .maybeSingle();
    if (pErr)
      return NextResponse.json(
        { ok: false, message: pErr.message },
        { status: 500 },
      );

    const currentStock = (pRaw?.stock ?? 0) as number;
    const { error: sErr } = await admin
      .from("products")
      .update({ stock: currentStock + it.qty })
      .eq("id", it.productId);
    if (sErr)
      return NextResponse.json(
        { ok: false, message: sErr.message },
        { status: 500 },
      );
  }

  return NextResponse.json({ ok: true });
}
