// app/api/admin/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COOKIE = "admin_session";

// ==== Zod types ====
const OrderItemDb = z.object({
  productName: z.string(),
  qty: z.number().int(),
  unitPrice: z.number(),
  lineTotal: z.number(),
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
type OrderItemRow = z.infer<typeof OrderItemDb>;
type OrderRow = z.infer<typeof OrderDb> & { items: OrderItemRow[] };

// map تب‌های UI به مقادیر DB
const statusMap: Record<string, string[] | null> = {
  all: null,
  pending: ["pending"],
  processing: ["paid"], // در UI = در حال پردازش → در DB = paid
  delivered: ["sent"], // در UI = تحویل شده → در DB = sent
  canceled: ["canceled"],
  returned: ["returned"], // اگر در DB چنین حالتی داری؛ اگر نداری خالی می‌ماند
};

// پاسخ
type AdminOrdersResponse = {
  ok: true;
  orders: OrderRow[];
  counts: {
    all: number;
    pending: number;
    processing: number;
    delivered: number;
    canceled: number;
    returned: number;
  };
  page: number;
  pageSize: number;
};

// امن بودن ادمین با کوکی (اگر TOTP/JWT داری، اینجا جایگزین کن)
function requireAdmin(req: NextRequest): string | null {
  return req.cookies.get(COOKIE)?.value ?? null;
}

export async function GET(req: NextRequest) {
  try {
    const adminId = requireAdmin(req);
    if (!adminId)
      return NextResponse.json(
        { ok: false, message: "UNAUTHORIZED" },
        { status: 401, headers: { "Cache-Control": "no-store" } },
      );

    const url = new URL(req.url);
    const statusParam = (url.searchParams.get("status") ?? "all").toLowerCase();
    const q = (url.searchParams.get("q") ?? "").trim();
    const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10));
    const pageSize = Math.min(
      50,
      Math.max(1, parseInt(url.searchParams.get("limit") ?? "20", 10)),
    );
    const offset = (page - 1) * pageSize;

    const wanted = statusMap[statusParam] ?? null;

    const sb = supabaseAdmin();

    // --- بیس کوئری برای لیست ---
    let query = sb
      .from("orders")
      .select(
        `
        id, userId, status, fullName, phone, address, note,
        subTotal, shippingFee, grandTotal, createdAt,
        items:orderItems ( productName, qty, unitPrice, lineTotal )
      `,
        { count: "exact" },
      )
      .order("createdAt", { ascending: false });

    if (wanted && wanted.length > 0) {
      query = query.in("status", wanted);
    }

    if (q) {
      // جست‌وجو روی نام/تلفن/شناسه سفارش
      query = query.or(
        [`fullName.ilike.%${q}%`, `phone.ilike.%${q}%`, `id.ilike.%${q}%`].join(
          ",",
        ),
      );
    }

    const { data: rows, error } = await query.range(
      offset,
      offset + pageSize - 1,
    );

    if (error) {
      return NextResponse.json(
        { ok: false, message: error.message },
        { status: 500, headers: { "Cache-Control": "no-store" } },
      );
    }

    const orders: OrderRow[] = (rows ?? []) as unknown as OrderRow[];

    // --- شمارش برای تب‌ها (همسان با جست‌وجو q) ---
    async function countFor(keys: string[] | null) {
      let c = sb.from("orders").select("id", { count: "exact", head: true });
      if (keys && keys.length > 0) c = c.in("status", keys);
      if (q)
        c = c.or(
          [
            `fullName.ilike.%${q}%`,
            `phone.ilike.%${q}%`,
            `id.ilike.%${q}%`,
          ].join(","),
        );
      const { count } = await c;
      return count ?? 0;
    }

    const [all, pend, proc, deli, canc, retu] = await Promise.all([
      countFor(null),
      countFor(statusMap.pending),
      countFor(statusMap.processing),
      countFor(statusMap.delivered),
      countFor(statusMap.canceled),
      countFor(statusMap.returned),
    ]);

    const body: AdminOrdersResponse = {
      ok: true,
      orders,
      counts: {
        all,
        pending: pend,
        processing: proc,
        delivered: deli,
        canceled: canc,
        returned: retu,
      },
      page,
      pageSize,
    };

    return NextResponse.json(body, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "INTERNAL_ERROR";
    return NextResponse.json(
      { ok: false, message: msg },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
