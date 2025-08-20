import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

type DB = unknown;

let cached: SupabaseClient<DB> | null = null;

/** کلاینت مرورگر (CSR) – یک‌بار می‌سازیم و کش می‌کنیم */
export function supabaseBrowser(): SupabaseClient<DB> {
  if (cached) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  cached = createBrowserClient<DB>(url, key);
  return cached;
}
