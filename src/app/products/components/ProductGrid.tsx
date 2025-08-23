import ProductCard from "../ProductCard";
import type { Item } from "@/types/product";
import SkeletonCard from "./SkeletonCard";

type Props = {
  items: Item[];
  loading: boolean;
};

export default function ProductGrid({ items, loading }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return <p className="text-slate-500">محصولی یافت نشد.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-3">
      {items.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
