// lib/storage.ts
import type { SupabaseClient } from "@supabase/supabase-js";

export async function uploadProductCover(
  sb: SupabaseClient,
  file: File, // ⬅️ دیگه nullable نیست
  slug: string,
): Promise<string> {
  // ⬅️ همیشه string برمی‌گرده
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${slug}-${Date.now()}.${ext}`;

  const { data, error } = await sb.storage
    .from("product-covers")
    .upload(path, file, {
      contentType: file.type || "image/jpeg",
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw new Error(`UPLOAD_FAILED:${error.message}`);

  const { data: pub } = sb.storage
    .from("product-covers")
    .getPublicUrl(data.path);
  return pub.publicUrl;
}
