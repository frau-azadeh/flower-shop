export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const BUCKET = "blog-covers";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file");
    const slugRaw = form.get("slug");

    // ولیدیشن
    if (!(file instanceof Blob)) {
      return NextResponse.json({ error: "file required" }, { status: 400 });
    }
    const slug = typeof slugRaw === "string" ? slugRaw.trim().toLowerCase() : "";
    if (!slug) {
      return NextResponse.json({ error: "slug required" }, { status: 400 });
    }

    // کلاینت سرور با Service Role => بدون RLS
    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // اسم فایل
    const name = (file as File).name || "cover.jpg";
    const ext = name.includes(".") ? name.split(".").pop()! : "jpg";
    const path = `${slug}/cover.${ext}`;

    // آپلود (overwrite)
    const { error: upErr } = await sb.storage.from(BUCKET).upload(path, file, {
      upsert: true,
      cacheControl: "3600",
      contentType: (file as File).type || `image/${ext}`
    });
    if (upErr) return NextResponse.json({ error: upErr.message }, { status: 400 });

    // URL عمومی
    const { data: pub } = sb.storage.from(BUCKET).getPublicUrl(path);
    if (!pub?.publicUrl) {
      return NextResponse.json({ error: "could not create public url" }, { status: 500 });
    }

    return NextResponse.json({ url: pub.publicUrl });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "UNKNOWN";
    // تا اگر باز HTML رندر شد، پیام JSON ببینی
    return NextResponse.json({ error: `UPLOAD_FAILED: ${msg}` }, { status: 500 });
  }
}
