type Props = {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    salePrice: number | null;
    coverUrl: string | null;
    category: string;
  };
};

export default function ProductCard({ product }: Props) {
  const price = product.salePrice ?? product.price;
  return (
    <a
      href={`/products/${product.slug}`}
      className="block rounded-2xl border border-slate-200 bg-white hover:shadow-md transition"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={product.coverUrl ?? "/placeholder.png"}
        alt={product.name}
        className="aspect-[4/3] w-full rounded-t-2xl object-cover"
      />
      <div className="p-3">
        <div className="mb-1 text-sm text-slate-500">{product.category}</div>
        <h3 className="line-clamp-1 font-medium">{product.name}</h3>
        <div className="mt-2 text-sm">
          {product.salePrice ? (
            <div className="flex items-center gap-2">
              <span className="font-semibold">
                {price.toLocaleString("fa-IR")} تومان
              </span>
              <span className="text-xs text-slate-400 line-through">
                {product.price.toLocaleString("fa-IR")} تومان
              </span>
            </div>
          ) : (
            <span className="font-semibold">
              {product.price.toLocaleString("fa-IR")} تومان
            </span>
          )}
        </div>
      </div>
    </a>
  );
}
