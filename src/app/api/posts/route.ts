import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Row = Record<string, unknown>;

export type BlogItem = {
  id: string;
  title: string;
  slug: string;
  coverUrl: string | null;
  excerpt: string | null;
  content: string | null;
  created_at: string | null;
};

// ---------- helpers (type-safe) ----------
function pickString(obj: Row, keys: readonly string[]): string | null {
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === "string" && v.trim() !== "") return v;
  }
  return null;
}
function pickBool(obj: Row, keys: readonly string[]): boolean | null {
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === "boolean") return v;
    if (typeof v === "string") {
      const s = v.trim().toLowerCase();
      if (s === "true") return true;
      if (s === "false") return false;
    }
  }
  return null;
}
function normalizeId(obj: Row): string | null {
  const v = obj["id"];
  if (typeof v === "string") return v;
  if (typeof v === "number") return String(v);
  return null;
}
function isRelationMissing(code?: string): boolean {
  // PGRST116: relation does not exist (PostgREST)
  return code === "PGRST116" || code === "42P01";
}

// ---------- route ----------
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const q = Number(url.searchParams.get("limit") ?? "4");
  const limit = Number.isFinite(q) ? Math.max(1, Math.min(q, 12)) : 4;

  const sb = supabaseAdmin();
  const tables: readonly string[] = ["posts", "blogPosts"]; // هر کدوم که موجود باشد

  for (const table of tables) {
    const { data, error } = await sb.from(table).select("*").order("id", { ascending: false }).limit(limit);

    if (isRelationMissing(error?.code)) continue; // جدول بعدی را امتحان کن
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (Array.isArray(data) && data.length > 0) {
      const mapped: BlogItem[] = (data as unknown[]).map((raw) => {
        const row = raw as Row;

        const id = normalizeId(row) ?? crypto.randomUUID();
        const title = pickString(row, ["title", "name"]) ?? "بدون عنوان";
        const slug =
          pickString(row, ["slug"]) ??
          id; // اگر اسلاگ نداریم از id استفاده می‌کنیم

        const coverUrl =
          pickString(row, ["coverUrl", "cover_url", "cover", "image", "coverURL"]) ?? null;
        const excerpt =
          pickString(row, ["excerpt", "summary", "description"]) ?? null;
        const content =
          pickString(row, ["content", "body", "html"]) ?? null;
        const created_at =
          pickString(row, ["created_at", "createdAt", "publishedAt", "date"]) ?? null;

        // اگر ستونی برای وضعیت/منتشر شده دارید؛ در غیر این صورت نادیده گرفته می‌شود
        const status = pickString(row, ["status", "state"]);
        const published = pickBool(row, ["published"]);
        const isDraft = status ? status.toLowerCase() === "draft" : published === false;
        // می‌خواهی در همین‌جا درفت‌ها حذف شوند؟ اگر بله، می‌توانی این شرط را فعال کنی:
        // if (isDraft) return null as never;

        return { id, title, slug, coverUrl, excerpt, content, created_at };
      });

      // فیلترِ nullهای احتمالی (اگر شرط بالا را فعال کردی)
      const rows: BlogItem[] = mapped.filter(Boolean);

      return NextResponse.json(
        { rows },
        { headers: { "Cache-Control": "no-store" } },
      );
    }
  }

  return NextResponse.json(
    { rows: [] as BlogItem[] },
    { headers: { "Cache-Control": "no-store" } },
  );
}
