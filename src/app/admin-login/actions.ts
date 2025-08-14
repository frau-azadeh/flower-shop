"use server";

import {createSupabaseClient}from "@/lib/supabase";
import bcrypt from "bcryptjs";
import { adminLoginSchema, type AdminLoginSchema } from "@/schemas/admin-auth.schema";

export type LoginResult =
  | { ok: true; user: { id: string; firstName: string; lastName: string; role: "BLOG" | "PRODUCTS" | "FULL" } }
  | { ok: false; message: string };

export async function loginAdmin(data: AdminLoginSchema): Promise<LoginResult> {
  const parsed = adminLoginSchema.safeParse(data);
  if (!parsed.success) {
    return { ok: false, message: "ورودی نامعتبر" };
  }

  const { firstName, lastName, password } = parsed.data;
  const sb = createSupabaseClient();

  const { data: user, error } = await sb
    .from("admin_users")
    .select("id, firstName, lastName, role, passwordHash, isActive")
    .eq("firstName", firstName)
    .eq("lastName", lastName)
    .maybeSingle();

  if (error || !user) return { ok: false, message: "کاربر یافت نشد" };
  if (!user.isActive) return { ok: false, message: "کاربر غیرفعال است" };

  const ok = await bcrypt.compare(password, user.passwordHash as string);
  if (!ok) return { ok: false, message: "رمز عبور نادرست است" };

  return {
    ok: true,
    user: {
      id: user.id as string,
      firstName: user.firstName as string,
      lastName: user.lastName as string,
      role: user.role as "BLOG" | "PRODUCTS" | "FULL",
    },
  };
}
