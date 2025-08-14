export type AdminRole = "BLOG" | "PRODUCTS" | "FULL";

export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  role: AdminRole;
  isActive: boolean;
  createdAt: string; // ISO
}
