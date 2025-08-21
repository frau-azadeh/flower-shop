import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

/* ------------ Types ------------ */
type ProfileRow = {
  id: string;
  fullName: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
};

type SaveBody = {
  fullName: string;
  phone: string;
  address: string;
  email?: string;
};

/* ------------ GET ------------ */
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
      .from("profiles")
      .select("id, fullName, phone, email, address")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        { ok: false, message: error.message },
        { status: 500 },
      );
    }

    const profile = (data ?? null) as ProfileRow | null;
    return NextResponse.json({ ok: true, profile });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "INTERNAL_ERROR";
    return NextResponse.json({ ok: false, message: msg }, { status: 500 });
  }
}

/* ------------ POST (upsert) ------------ */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SaveBody;

    if (!body.fullName || body.fullName.trim().length < 2) {
      return NextResponse.json(
        { ok: false, message: "نام معتبر نیست" },
        { status: 400 },
      );
    }
    if (!/^\d{10,11}$/.test(body.phone)) {
      return NextResponse.json(
        { ok: false, message: "شماره تماس معتبر نیست" },
        { status: 400 },
      );
    }
    if (!body.address || body.address.trim().length < 10) {
      return NextResponse.json(
        { ok: false, message: "آدرس خیلی کوتاه است" },
        { status: 400 },
      );
    }
    if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return NextResponse.json(
        { ok: false, message: "ایمیل معتبر نیست" },
        { status: 400 },
      );
    }

    const sb = await supabaseServer();
    const { data: u } = await sb.auth.getUser();
    const userId = u.user?.id;
    if (!userId) {
      return NextResponse.json(
        { ok: false, message: "UNAUTHORIZED" },
        { status: 401 },
      );
    }

    const { error } = await sb.from("profiles").upsert(
      {
        id: userId,
        fullName: body.fullName.trim(),
        phone: body.phone.trim(),
        email: body.email ? body.email.trim() : null,
        address: body.address.trim(),
      },
      { onConflict: "id" },
    );

    if (error) {
      return NextResponse.json(
        { ok: false, message: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "INTERNAL_ERROR";
    return NextResponse.json({ ok: false, message: msg }, { status: 500 });
  }
}
