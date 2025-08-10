// app/components/user/Addresses.tsx
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MapPin, Plus, X, Save } from "lucide-react";

const UserAddress = ()=> {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const isFormOpen = searchParams.get("address") === "new";

  const openForm = () => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("address", "new");
    router.replace(`${pathname}?${sp.toString()}`, { scroll: false });
  };

  const closeForm = () => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.delete("address");
    const url = sp.toString() ? `${pathname}?${sp.toString()}` : pathname;
    router.replace(url, { scroll: false });
  };

  return (
    <section dir="rtl" className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6 text-right">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-800">آدرس‌ها</h3>
        {!isFormOpen && (
          <button onClick={openForm} className="inline-flex items-center gap-2 text-accent hover:opacity-90">
            <Plus className="size-5" />
            <span>افزودن آدرس جدید</span>
          </button>
        )}
      </div>

      <hr className="mb-6 border-slate-200" />

      {/* Empty OR Form */}
      {!isFormOpen ? (
        // Empty state
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <MapPin className="size-24 text-slate-300" />
          <p className="mt-6 text-sm md:text-base text-slate-700">هنوز هیچ آدرسی ثبت نکرده‌اید.</p>
        </div>
      ) : (
        // Add Address Form (UI only)
        <div className="mx-auto max-w-2xl">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="size-5 text-accent" />
              <h4 className="font-semibold">افزودن آدرس</h4>
            </div>
            <button onClick={closeForm} className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-700">
              <X className="size-5" />
              بستن
            </button>
          </div>

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              // فقط UI — اینجا بعداً می‌تونی submit واقعی وصل کنی
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <span className="mb-1 block text-xs text-slate-600">نام و نام خانوادگی</span>
                <input className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20" />
              </label>

              <label className="block">
                <span className="mb-1 block text-xs text-slate-600">شماره تماس</span>
                <input className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20" />
              </label>

              <label className="block">
                <span className="mb-1 block text-xs text-slate-600">استان</span>
                <input className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20" />
              </label>

              <label className="block">
                <span className="mb-1 block text-xs text-slate-600">شهر</span>
                <input className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20" />
              </label>

              <label className="block md:col-span-2">
                <span className="mb-1 block text-xs text-slate-600">آدرس دقیق</span>
                <textarea rows={3} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20" />
              </label>

              <label className="block md:col-span-2 md:max-w-xs">
                <span className="mb-1 block text-xs text-slate-600">کد پستی</span>
                <input className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20" />
              </label>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-white hover:opacity-90"
                disabled
                title="صرفاً UI — بعداً ذخیره‌سازی را وصل کن"
              >
                <Save className="size-5" />
                ذخیره آدرس
              </button>
              <button type="button" onClick={closeForm} className="rounded-xl border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50">
                انصراف
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

export default UserAddress
