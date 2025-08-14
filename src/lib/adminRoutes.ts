import type { AdminRole } from "@/types/admin";

export function homePathByRole(role: AdminRole): string {
  if (role === "FULL") return "/admin/dashboard";
  if (role === "BLOG") return "/admin/blog";
  return "/admin/products"; // PRODUCTS
}
