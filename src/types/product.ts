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
