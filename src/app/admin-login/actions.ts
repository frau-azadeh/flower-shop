"use server";

import bcrypt from "bcryptjs";
import { supabaseServer } from "@/lib/supabaseServer";

export type Role = "BLOG" | "PRODUCTS" | "FULL";

export interface AdminLoginInput {
  firstName: string;
  lastName: string;
  password: string;
}

export type LoginResult =
  | { ok: true; user: { id: string; firstName: string; lastName: string; role: Role } }
  | { ok: false; message: string };

export async function loginAdmin(input: AdminLoginInput): Promise<LoginResult> {
  const first = input.firstName?.trim();
  const last = input.lastName?.trim();
  const pass = input.password ?? "";
  if (!first || !last || pass.length < 4) {
    return { ok: false, message: "ورودی نامعتبر" };
  }

  const sb = supabaseServer();

  const { data, error } = await sb
    .from("admin_users")
    .select("id, firstName, lastName, role, isActive, passwordHash")
    .eq("firstName", first)
    .eq("lastName", last)
    .limit(1);

  if (error || !data?.[0]) return { ok: false, message: "کاربر یافت نشد" };

  const u = data[0];
  const active = u.isActive === true || String(u.isActive).toLowerCase() === "true";
  if (!active) return { ok: false, message: "کاربر غیرفعال است" };

  const ok = await bcrypt.compare(pass, String(u.passwordHash ?? ""));
  if (!ok) return { ok: false, message: "رمز عبور نادرست" };

  return {
    ok: true,
    user: {
      id: String(u.id),
      firstName: String(u.firstName),
      lastName: String(u.lastName),
      role: u.role as Role,
    },
  };
}
