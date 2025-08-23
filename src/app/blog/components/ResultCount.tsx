type Props = { count: number };

export default function ResultCount({ count }: Props) {
  return (
    <div className="mt-2 text-xs text-slate-500">
      {count.toLocaleString("fa-IR")} نتیجه یافت شد
    </div>
  );
}
