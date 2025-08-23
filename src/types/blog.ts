export type Role = "BLOG" | "PRODUCTS" | "FULL";
export type Status = "draft" | "published";

export interface AdminMinimal {
  role: Role;
  isActive: boolean;
}

export interface SavePayload {
  title: string;
  slug: string;
  content?: string;
  status?: Status;
  coverUrl?: string; // اگر در DB NOT NULL است، ما خالی می‌فرستیم
}

export interface PublishPayload {
  slug: string;
}

export interface IdSlug {
  id: string;
  slug: string;
}

export type PostRow = {
  title: string;
  slug: string;
  content: string; // HTML
  publishedAt: string | null;
  coverUrl: string | null;
};
