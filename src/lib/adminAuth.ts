// lib/adminAuth.ts
import { cookies } from "next/headers";
import { supabaseServer } from "@/lib/supabaseServer";

export type Role = "BLOG" | "PRODUCTS" | "FULL"; // جداش کن تا وابسته به فایل‌های دیگه نشه

const ADMIN_COOKIE_NAME = "aid"; // ⬅️ یک منبع حقیقت

type AdminUser = {
  id: string;
  firstName: string;
  lastName: string;
  role: Role;
  isActive: boolean;
};

export async function getAdminOrThrow(allowed: Role[]): Promise<AdminUser> {
  const c = await cookies(); // Next 15: await
  const adminId = c.get(ADMIN_COOKIE_NAME)?.value;
  if (!adminId) throw new Error("UNAUTHORIZED");

  const sb = supabaseServer();
  const { data, error } = await sb
    .from("admin_users")
    .select("id, firstName, lastName, role, isActive")
    .eq("id", adminId)
    .limit(1);

  if (error || !data?.[0]) throw new Error("UNAUTHORIZED");

  const u = data[0];
  const active =
    u.isActive === true || String(u.isActive).toLowerCase() === "true";
  if (!active) throw new Error("FORBIDDEN");
  if (!allowed.includes(u.role as Role)) throw new Error("FORBIDDEN");

  return {
    id: String(u.id),
    firstName: String(u.firstName),
    lastName: String(u.lastName),
    role: u.role as Role,
    isActive: active,
  };
}
