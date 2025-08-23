import { Suspense } from "react";
import UserAddressClient from "@/app/components/user/UserAddress";

// جلوگیری از prerender در زمان build
export const dynamic = "force-dynamic"; // یا: export const revalidate = 0;
// اگر کش فچ را هم می‌خواهی غیرفعال کنی:
// export const fetchCache = "default-no-store";

export default function Page() {
  return (
    <Suspense
      fallback={
        <section
          dir="rtl"
          className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6 text-right"
        >
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
            در حال بارگذاری…
          </div>
        </section>
      }
    >
      <UserAddressClient />
    </Suspense>
  );
}
