export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

type Status = "draft" | "published";
interface SaveBody {
  title: string;
  slug: string;
  content?: string;
  status?: Status;
  coverUrl?: string;
}

export async function POST(req: Request) {
  try {
    // اگر راه ۱ را رفتی، همین کوکی aid کافی است (admin_users.id)
    // اگر راه ۲ را رفتی، این را به auid تغییر بده
    const c = await cookies();
    const authorId = c.get("aid")?.value ?? null;

    const body: SaveBody = await req.json();
    const title = body.title?.trim();
    const slug = body.slug?.trim().toLowerCase();
    if (!title || !slug) {
      return NextResponse.json(
        { error: "title/slug required" },
        { status: 400 },
      );
    }

    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!, // فقط روی سرور
    );

    const { data, error } = await sb
      .from("posts")
      .insert({
        authorId, // با FK جدید می‌نشیند
        title,
        slug,
        content: body.content ?? "",
        status: (body.status ?? "draft") as Status,
        coverUrl: (body.coverUrl ?? "").trim(), // چون برای coverUrl پیش‌فرض گذاشتی
      })
      .select("id, slug")
      .limit(1);

    if (error)
      return NextResponse.json({ error: error.message }, { status: 400 });
    const row = data?.[0];
    if (!row)
      return NextResponse.json({ error: "INSERT_FAILED" }, { status: 400 });

    return NextResponse.json({ id: String(row.id), slug: String(row.slug) });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "UNKNOWN";
    return NextResponse.json(
      { error: `SERVER_ERROR: ${msg}` },
      { status: 500 },
    );
  }
}
