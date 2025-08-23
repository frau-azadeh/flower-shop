export type AdminRole = "BLOG" | "PRODUCTS" | "FULL";

export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  role: AdminRole;
  isActive: boolean;
  createdAt: string; // ISO
}

export type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice: number | null;
  category: string;
  stock: number;
  active: boolean;
  coverUrl: string | null;
  createdAt: string;
  description: string | null;
};

export type ListResponse = {
  ok: boolean;
  items: Product[];
  page: number;
  pageSize: number;
  total: number;
  message?: string;
};
