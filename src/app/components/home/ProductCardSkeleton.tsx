// src/app/components/home/ProductCardSkeleton.tsx
export default function ProductCardSkeleton() {
  return (
    <div className="h-full overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
      <div className="aspect-[4/3] animate-pulse bg-slate-100" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
        <div className="h-4 w-1/3 animate-pulse rounded bg-slate-100" />
        <div className="flex items-center justify-between">
          <div className="h-8 w-28 animate-pulse rounded bg-slate-100" />
          <div className="h-4 w-12 animate-pulse rounded bg-slate-100" />
        </div>
      </div>
    </div>
  );
}
