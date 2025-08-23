export type PublicProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice: number | null;
  category: string;
  coverUrl: string | null;
  createdAt: string;
  description?: string | null;
};

export type Item = {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice: number | null;
  category: string;
  coverUrl: string | null;
  createdAt: string;
};

export type BrowseOk = {
  ok: true;
  items: Item[];
  total: number;
  page: number;
  pageSize: number;
  categories: string[];
  price: { min: number | null; max: number | null };
};

export type BrowseBad = { ok: false; message: string };

export type BrowseRes = BrowseOk | BrowseBad;

export type InitialState = {
  q?: string;
  categories?: string[];
  min?: number;
  max?: number;
};
