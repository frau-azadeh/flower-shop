import ProductsBrowser from "./ProductsBrowser";

type PageProps = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    min?: string;
    max?: string;
  }>;
};

export default async function ProductsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  return (
    <div className="bg-background">
    <main dir="rtl" className="mx-auto max-w-6xl p-4">
      <h1 className="mb-4 text-lg font-bold">محصولات</h1>
       <ProductsBrowser
        initial={{
          q: sp?.q ?? "",
          categories: sp?.category ? sp.category.split(",") : [],
          min: sp?.min ? Number(sp.min) : undefined,
          max: sp?.max ? Number(sp.max) : undefined,
        }}
      />
    </main>
    </div>

  );
}
