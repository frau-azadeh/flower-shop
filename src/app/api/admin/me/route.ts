// app/api/admin/me/route.ts
import { NextRequest, NextResponse } from "next/server";

const COOKIE = "admin_session";

export async function GET(req: NextRequest) {
  const adminId = req.cookies.get(COOKIE)?.value;
  if (!adminId)
    return NextResponse.json(
      { ok: false },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );

  return NextResponse.json(
    { ok: true, admin: { id: adminId } },
    { status: 200, headers: { "Cache-Control": "no-store" } },
  );
}
