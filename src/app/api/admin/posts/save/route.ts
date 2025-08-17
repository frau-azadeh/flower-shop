export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type Status = "draft" | "published";
interface SaveBody {
  id?: string;
  title: string;
  slug: string;
  content: string;
  status: Status;
  coverUrl?: string | null;
  tags?: string[]; // اگر در DB text[] نیست، حذفش کن یا نگه دار
}

export async function POST(req: Request) {
  try {
    const b = (await req.json()) as SaveBody;

    const title = b.title?.trim();
    const slug = b.slug?.trim().toLowerCase();
    if (!title || !slug) {
      return NextResponse.json({ error: "title/slug required" }, { status: 400 });
    }

    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const payload = {
      title,
      slug,
      content: b.content ?? "",
      status: (b.status ?? "draft") as Status,
      coverUrl: b.coverUrl ?? null,
      updatedAt: new Date().toISOString()
    };

    if (b.id) {
      const { data, error } = await sb
        .from("posts")
        .update(payload)
        .eq("id", b.id)
        .select("id, slug")
        .limit(1);

      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      const row = data?.[0];
      return NextResponse.json({ id: String(row.id), slug: String(row.slug) });
    } else {
      const { data, error } = await sb
        .from("posts")
        .insert(payload)
        .select("id, slug")
        .limit(1);

      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      const row = data?.[0];
      return NextResponse.json({ id: String(row.id), slug: String(row.slug) });
    }
  } catch (e) {
    return NextResponse.json(
      { error: `SAVE_FAILED: ${(e as Error).message}` },
      { status: 500 }
    );
  }
}
