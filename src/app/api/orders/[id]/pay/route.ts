// app/api/orders/[id]/pay/route.ts
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

type Params = { params: { id: string } };

export async function POST(_req: Request, { params }: Params) {
  try {
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
      .eq("id", params.id)
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
      .eq("id", params.id);

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
