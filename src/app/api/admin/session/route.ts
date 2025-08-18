// app/api/admin/session/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { adminId } = (await req.json()) as { adminId?: string };
  if (!adminId) {
    return NextResponse.json(
      { ok: false, message: "adminId لازم است" },
      { status: 400 },
    );
  }

  const c = await cookies();
  c.set("aid", adminId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production", // ⬅️ توصیه
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 روز
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const c = await cookies();
  c.set("aid", "", { path: "/", maxAge: 0 });
  return NextResponse.json({ ok: true });
}
