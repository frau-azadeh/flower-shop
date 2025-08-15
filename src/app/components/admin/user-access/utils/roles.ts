"use client";

import type { AdminRole } from "@/types/admin";

export function canBlog(role: AdminRole) {
  return role === "BLOG" || role === "FULL";
}
export function canProducts(role: AdminRole) {
  return role === "PRODUCTS" || role === "FULL";
}
export function roleFromToggles(blog: boolean, commerce: boolean): AdminRole {
  if (blog && commerce) return "FULL";
  if (blog) return "BLOG";
  if (commerce) return "PRODUCTS";
  return "BLOG"; // default stays the same as original
}
