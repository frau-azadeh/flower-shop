// src/app/api/orders/[id]/cancel/route.ts
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

/** Narrow, data-only types for rows we read/write */
type OrderMini = {
  id: string;
  userId: string;
  status: "pending" | "paid" | "sent" | "canceled";
};

type OrderItemMini = {
  productId: string;
  qty: number;
};

/** ---- Safe helpers to extract params.id without using `any` ---- */
type RouteCtxWithId = { params: { id: string } };

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function getIdFromCtx(ctx: unknown): string {
  if (!isRecord(ctx)) {
    throw new Error("Invalid route context");
  }
  const params = (ctx as Record<string, unknown>)["params"];
  if (!isRecord(params)) {
    throw new Error("Missing params");
  }
  const id = (params as Record<string, unknown>)["id"];
  if (typeof id !== "string" || id.length === 0) {
    throw new Error("Invalid or missing id param");
  }
  return id;
}
/** ---------------------------------------------------------------- */

export async function POST(_req: Request, ctx: unknown) {
  // Safely extract / validate :id
  let id: string;
  try {
    id = getIdFromCtx(ctx);
  } catch (e) {
    return NextResponse.json(
      { ok: false, message: (e as Error).message },
      { status: 400 },
    );
  }

  const sb = await supabaseServer();
  const admin = supabaseAdmin();

  // 1) احراز هویت
  const { data: uRes } = await sb.auth.getUser();
  const userId = uRes.user?.id;
  if (!userId) {
    return NextResponse.json(
      { ok: false, message: "UNAUTHORIZED" },
      { status: 401 },
    );
  }

  // 2) سفارش را پیدا کن (همین کاربر + هر وضعیتی)
  const { data: ordRaw, error: ordErr } = await sb
    .from("orders")
    .select("id, userId, status")
    .eq("id", id)
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

  // 3) اقلام سفارش
  const { data: itemsRaw, error: itemsErr } = await admin
    .from("orderItems")
    .select("productId, qty")
    .eq("orderId", id);

  if (itemsErr) {
    return NextResponse.json(
      { ok: false, message: itemsErr.message },
      { status: 500 },
    );
  }
  const items = (itemsRaw ?? []) as OrderItemMini[];

  // 4) تغییر وضعیت سفارش به canceled
  const { error: upErr } = await admin
    .from("orders")
    .update({ status: "canceled" })
    .eq("id", id);

  if (upErr) {
    return NextResponse.json(
      { ok: false, message: upErr.message },
      { status: 500 },
    );
  }

  // 5) برگرداندن موجودی
  for (const it of items) {
    const { data: pRaw, error: pErr } = await admin
      .from("products")
      .select("stock")
      .eq("id", it.productId)
      .maybeSingle();

    if (pErr) {
      return NextResponse.json(
        { ok: false, message: pErr.message },
        { status: 500 },
      );
    }

    const currentStock = (pRaw?.stock ?? 0) as number;

    const { error: sErr } = await admin
      .from("products")
      .update({ stock: currentStock + it.qty })
      .eq("id", it.productId);

    if (sErr) {
      return NextResponse.json(
        { ok: false, message: sErr.message },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ ok: true });
}
