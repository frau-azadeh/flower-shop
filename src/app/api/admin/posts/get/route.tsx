export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type Status = "draft" | "published";
interface PostDetail {
  id: string;
  title: string;
  slug: string;
  status: Status;
  coverUrl?: string | null;
  updatedAt?: string | null;
  publishedAt?: string | null;
  content: string;
  tags?: string[] | null;
}

export async function POST(req: Request) {
  try {
    const { id } = (await req.json()) as { id?: string };
    if (!id)
      return NextResponse.json({ error: "id required" }, { status: 400 });

    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    const { data, error } = await sb
      .from("posts")
      .select(
        "id, title, slug, status, coverUrl, updatedAt, publishedAt, content, tags",
      )
      .eq("id", id)
      .maybeSingle();

    if (error)
      return NextResponse.json({ error: error.message }, { status: 400 });
    if (!data)
      return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });

    const row: PostDetail = data as PostDetail;
    return NextResponse.json({ ok: true, row });
  } catch (e) {
    const m = e instanceof Error ? e.message : "UNKNOWN";
    return NextResponse.json({ error: m }, { status: 500 });
  }
}
