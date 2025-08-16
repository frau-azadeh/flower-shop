// app/api/admin/session/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// ست‌کردن کوکی "aid"
export async function POST(req: Request) {
  const { adminId } = (await req.json()) as { adminId?: string };
  if (!adminId) {
    return NextResponse.json(
      { ok: false, message: "adminId لازم است" },
      { status: 400 },
    );
  }

  const c = await cookies(); // ← در Next 15 باید await بگذاری
  c.set("aid", adminId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  return NextResponse.json({ ok: true });
}

// پاک‌کردن کوکی هنگام خروج
export async function DELETE() {
  const c = await cookies();
  c.set("aid", "", { path: "/", maxAge: 0 });
  return NextResponse.json({ ok: true });
}
