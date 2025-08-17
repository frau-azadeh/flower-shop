export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type Status = "draft" | "published";
interface PostRow {
  id: string;
  title: string;
  slug: string;
  status: Status;
  coverUrl?: string | null;
  updatedAt?: string | null;
  publishedAt?: string | null;
  content?: string | null; // اگر لازم داری
}

export async function GET() {
  try {
    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await sb
      .from("posts")
      .select("id, title, slug, status, coverUrl, updatedAt, publishedAt")
      .order("updatedAt", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ ok: true, rows: (data ?? []) as PostRow[] });
  } catch (e) {
    return NextResponse.json(
      { error: `LIST_FAILED: ${(e as Error).message}` },
      { status: 500 }
    );
  }
}
