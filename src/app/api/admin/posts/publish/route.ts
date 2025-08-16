export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const { slug } = (await req.json()) as { slug?: string };
    const clean = slug?.trim().toLowerCase();
    if (!clean)
      return NextResponse.json({ error: "slug required" }, { status: 400 });

    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    const { data, error } = await sb
      .from("posts")
      .update({ status: "published", publishedAt: new Date().toISOString() })
      .eq("slug", clean)
      .select("id, slug")
      .limit(1);

    if (error)
      return NextResponse.json({ error: error.message }, { status: 400 });
    const row = data?.[0];
    if (!row) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });

    return NextResponse.json({ id: String(row.id), slug: String(row.slug) });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "UNKNOWN";
    return NextResponse.json(
      { error: `SERVER_ERROR: ${msg}` },
      { status: 500 },
    );
  }
}
