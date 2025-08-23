import Link from "next/link";

export default function NotFound() {
  return (
    <main dir="rtl" className="mx-auto max-w-3xl p-6">
      <h1 className="text-lg font-bold">محصول یافت نشد</h1>
      <p className="mt-2 text-slate-600">
        ممکن است محصول حذف یا غیرفعال شده باشد.
      </p>
      <Link
        href="/products"
        className="mt-4 inline-block rounded-xl border px-3 py-2 text-sm"
      >
        بازگشت به محصولات
      </Link>
    </main>
  );
}
