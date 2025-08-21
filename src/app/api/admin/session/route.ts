// app/api/admin/session/route.ts
import { NextRequest, NextResponse } from "next/server";

// یک نام ثابت برای کوکی سشن ادمین
const COOKIE = "admin_session";
// عمر سشن (۷ روز)
const MAX_AGE = 60 * 60 * 24 * 7;

export async function POST(req: NextRequest) {
  const { adminId } = (await req.json()) as { adminId?: string };
  if (!adminId) {
    return NextResponse.json(
      { ok: false, message: "BAD_REQUEST" },
      { status: 400 },
    );
  }

  const res = NextResponse.json({ ok: true });
  // ساده: مقدار = adminId ؛ اگر خواستی می‌تونی JWT امضا کنی
  res.cookies.set(COOKIE, adminId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
