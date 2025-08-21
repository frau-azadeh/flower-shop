// app/api/orders/[id]/pay/route.ts
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

/** Extracts the order id from a path like /api/orders/:id/pay */
function extractOrderIdFromUrl(urlStr: string): string {
  const url = new URL(urlStr);
  const parts = url.pathname.split("/").filter(Boolean); // ["api","orders",":id","pay"]
  const idx = parts.findIndex((p) => p === "orders");
  const id = idx >= 0 ? parts[idx + 1] : "";
  if (!id) throw new Error("Invalid or missing order id");
  return id;
}

export async function POST(req: Request) {
  try {
    const orderId = extractOrderIdFromUrl(req.url);
    const sb = await supabaseServer();

    // احراز هویت
    const { data: u } = await sb.auth.getUser();
    const userId = u.user?.id;
    if (!userId) {
      return NextResponse.json(
        { ok: false, message: "UNAUTHORIZED" },
        { status: 401 },
      );
    }

    // سفارش باید متعلق به خود کاربر باشد
    const { data: order, error: selErr } = await sb
      .from("orders")
      .select("id, userId, status")
      .eq("id", orderId)
      .maybeSingle();

    if (selErr) {
      return NextResponse.json(
        { ok: false, message: selErr.message },
        { status: 500 },
      );
    }
    if (!order || order.userId !== userId) {
      return NextResponse.json(
        { ok: false, message: "NOT_FOUND" },
        { status: 404 },
      );
    }
    if (order.status !== "pending") {
      return NextResponse.json(
        { ok: false, message: "INVALID_STATE" },
        { status: 400 },
      );
    }

    const { error: upErr } = await sb
      .from("orders")
      .update({ status: "paid" })
      .eq("id", orderId);

    if (upErr) {
      return NextResponse.json(
        { ok: false, message: upErr.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "INTERNAL_ERROR";
    return NextResponse.json({ ok: false, message: msg }, { status: 500 });
  }
}
