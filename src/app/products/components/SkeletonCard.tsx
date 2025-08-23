export default function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200 bg-white">
      <div className="aspect-[4/3] w-full rounded-t-2xl bg-slate-100" />
      <div className="p-3 space-y-2">
        <div className="h-3 w-24 rounded bg-slate-100" />
        <div className="h-4 w-40 rounded bg-slate-100" />
        <div className="h-4 w-28 rounded bg-slate-100" />
      </div>
    </div>
  );
}
