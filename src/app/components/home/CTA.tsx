// src/app/components/home/CTA.tsx
"use client";

import Link from "next/link";
import { Gift, Phone, Truck, PenLine, ShieldCheck } from "lucide-react";

export default function CTA() {
  return (
    <section dir="rtl" className="relative isolate py-14">
      {/* پس‌زمینه تصویری از public/images.jfif */}
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: "url('/images.jfif')" }}
        aria-hidden
      />
      {/* لایه تیره برای کنتراست */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/35 via-emerald-900/20 to-black/40" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* قاب بیرونی با حاشیه گرادیانی */}
        <div className="relative rounded-[30px] p-[2px] bg-gradient-to-r from-white/45 via-white/35 to-white/45 shadow-[0_18px_45px_rgba(0,0,0,.25)]">
          {/* کارت شیشه‌ای */}
          <div className="rounded-[28px] bg-white/5 backdrop-blur-xl ring-1 ring-white/20">
            <div className="grid gap-8 p-6 md:grid-cols-2 md:items-center md:p-10 lg:p-12">
              {/* آیکن/تصویر – شیشه‌ای حرفه‌ای */}
              <div className="order-1 md:order-2">
                <div className="relative mx-auto w-full max-w-[260px]">
                  {/* هاله‌ی نور پس‌زمینه برای عمق بیشتر */}
                  <div className="absolute -inset-3 rounded-[32px] bg-emerald-500/25 blur-2xl" />
                  {/* قاب گرادیانیِ براق */}
                  <div className="relative rounded-[32px] p-[3px] bg-gradient-to-br from-white/65 via-white/30 to-white/65 ring-1 ring-white/20 shadow-[0_20px_50px_rgba(0,0,0,.35)]">
                    {/* کاشی/کارد شیشه‌ای اصلی */}
                    <div className="relative overflow-hidden rounded-[28px] bg-white/10 backdrop-blur-xl ring-1 ring-white/25">
                      {/* های‌لایت شیشه‌ای در گوشه‌ی بالا-چپ */}
                      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(160px_140px_at_30%_20%,rgba(255,255,255,.55),transparent_60%)]" />
                      {/* بافت خیلی لطیف برای حس شیشه */}
                      <div className="pointer-events-none absolute inset-0 opacity-[.10] mix-blend-overlay [background:repeating-linear-gradient(0deg,rgba(255,255,255,.7),rgba(255,255,255,.7)_1px,transparent_1px,transparent_14px),repeating-linear-gradient(90deg,rgba(255,255,255,.7),rgba(255,255,255,.7)_1px,transparent_1px,transparent_14px)]" />

                      {/* محتوای داخل کاشی */}
                      <div className="grid h-[220px] place-items-center">
                        <div className="grid h-28 w-28 place-items-center rounded-2xl bg-white/30 backdrop-blur-sm ring-1 ring-white/50 shadow-[inset_0_1px_10px_rgba(255,255,255,.35)]">
                          <Gift className="size-16 text-emerald-700" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* متن و CTA */}
              <div className="order-2 md:order-1">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600/10 px-3 py-1 text-[12px] font-semibold text-emerald-800 ring-1 ring-emerald-700/20">
                  جدید ویژه‌ی مناسبت‌ها
                </span>

                <h3 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-emerald-900 md:text-4xl">
                  سورپرایزِ خاص با{" "}
                  <span className="bg-gradient-to-l from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                    باکس‌های هدیه
                  </span>
                </h3>

                <p className="mt-3 max-w-xl text-slate-800">
                  باکس‌های سفارشی با کارت دست‌نویس و بسته‌بندی چشم‌نواز؛ هم برای
                  تبریک‌ها، هم برای دلبرانه‌ها. همین حالا انتخاب کن.
                </p>

                {/* مزایا */}
                <ul className="mt-5 flex flex-wrap gap-2 text-sm">
                  <li className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-1.5 text-emerald-800 ring-1 ring-emerald-700/10">
                    <PenLine className="size-4" />
                    کارت دست‌نویس رایگان
                  </li>
                  <li className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-1.5 text-emerald-800 ring-1 ring-emerald-700/10">
                    <Truck className="size-4" />
                    ارسال همان‌روز
                  </li>
                  <li className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-1.5 text-emerald-800 ring-1 ring-emerald-700/10">
                    <ShieldCheck className="size-4" />
                    بسته‌بندی حرفه‌ای
                  </li>
                </ul>

                {/* دکمه‌ها */}
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/gift"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white shadow-lg shadow-emerald-600/30 transition-colors hover:bg-emerald-700"
                  >
                    <Gift className="size-4" />
                    مشاهده باکس‌های هدیه
                  </Link>

                  <Link
                    href="tel:09012764435"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-emerald-800 ring-1 ring-emerald-700/15 transition-colors hover:bg-white/90"
                  >
                    <Phone className="size-4" />
                    09012764435 (تماس فوری)
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* هایلایت دور قاب */}
          <div className="pointer-events-none absolute inset-0 rounded-[30px] ring-1 ring-white/20" />
        </div>
      </div>
    </section>
  );
}
