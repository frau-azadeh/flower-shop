import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export const revalidate = 60; // هر ۱ دقیقه رفرش ISR

type Row = { id: string; name: string; slug: string };

export async function GET() {
  const sb = supabaseServer();
  const { data, error } = await sb
    .from("products")
    .select("id, name, slug")
    .eq("active", true)
    .order("createdAt", { ascending: false })
    .limit(4);

  if (error) {
    return NextResponse.json({ ok: false, error: "DB_ERROR" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, rows: (data ?? []) as Row[] });
}
