"use server";

import bcrypt from "bcryptjs";
import { createSupabaseClient } from "@/lib/supabase";
import type { AdminUser, AdminRole } from "@/types/admin";

function rowToUser(r: Record<string, unknown>): AdminUser {
  return {
    id: r.id as string,
    firstName: r.firstName as string,
    lastName: r.lastName as string,
    role: r.role as AdminRole,
    isActive: r.isActive as boolean,
    createdAt: r.createdAt as string,
  };
}

export async function listUsers(q: string): Promise<AdminUser[]> {
  const sb = createSupabaseClient();

  let query = sb
    .from("admin_users")
    .select("id, firstName, lastName, role, isActive, createdAt")
    .order("createdAt", { ascending: false });

  const s = q.trim();
  if (s) query = query.or(`firstName.ilike.%${s}%,lastName.ilike.%${s}%`);

  const { data } = await query;
  return (data ?? []).map(rowToUser);
}

export async function createUser(input: {
  firstName: string;
  lastName: string;
  password: string;
  role: AdminRole;
  isActive: boolean;
}): Promise<AdminUser> {
  const sb = createSupabaseClient();
  const passwordHash = await bcrypt.hash(input.password, 10);

  const { data } = await sb
    .from("admin_users")
    .insert({
      firstName: input.firstName,
      lastName: input.lastName,
      passwordHash,
      role: input.role,
      isActive: input.isActive,
    })
    .select("id, firstName, lastName, role, isActive, createdAt")
    .single();

  return rowToUser(data as Record<string, unknown>);
}

export async function updateUser(
  id: string,
  patch: {
    firstName: string;
    lastName: string;
    role: AdminRole;
    isActive: boolean;
    password?: string; // اختیاری
  },
): Promise<AdminUser> {
  const sb = createSupabaseClient();

  const updateObj: Record<string, unknown> = {
    firstName: patch.firstName,
    lastName: patch.lastName,
    role: patch.role,
    isActive: patch.isActive,
  };
  if (patch.password && patch.password.length > 0) {
    updateObj.passwordHash = await bcrypt.hash(patch.password, 10);
  }

  const { data } = await sb
    .from("admin_users")
    .update(updateObj)
    .eq("id", id)
    .select("id, firstName, lastName, role, isActive, createdAt")
    .single();

  return rowToUser(data as Record<string, unknown>);
}

export async function deleteUser(id: string): Promise<void> {
  const sb = createSupabaseClient();
  await sb.from("admin_users").delete().eq("id", id);
}
