// src/app/components/home/WhyUs.tsx
"use client";

import Link from "next/link";
import {
  DollarSign,
  Sprout,
  Flower2,
  Award,
  Truck,
  Headset,
  Leaf,
  Phone,
} from "lucide-react";
import React from "react";

type Feature = {
  title: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const FEATURES: Feature[] = [
  { title: "قیمت رقابتی", Icon: DollarSign },
  { title: "محصولات خاص", Icon: Sprout },
  { title: "تنوع بی‌نظیر", Icon: Flower2 },
  { title: "ضمانت کیفیت", Icon: Award },
  { title: "دسترسی راحت", Icon: Truck },
  { title: "پشتیبانی آنلاین", Icon: Headset },
];

export default function WhyUs() {
  return (
    <section dir="rtl" className="relative isolate py-12 md:py-18">
      {/* پس‌زمینه: همان تصویر بخش‌های قبلی */}
      <div
        className="absolute inset-0 -z-30 bg-cover bg-center"
        style={{ backgroundImage: "url('/images.jfif')" }}
        aria-hidden
      />
      {/* لایه‌های کنتراست */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-black/45 via-emerald-900/25 to-black/50" />
      <div className="absolute inset-0 -z-10 opacity-[.06] mix-blend-overlay [background:repeating-linear-gradient(0deg,rgba(255,255,255,.7),rgba(255,255,255,.7)_1px,transparent_1px,transparent_14px),repeating-linear-gradient(90deg,rgba(255,255,255,.7),rgba(255,255,255,.7)_1px,transparent_1px,transparent_14px)]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* عنوان */}
        <h2 className="flex items-center justify-center gap-2 text-center text-2xl md:text-3xl font-extrabold text-white drop-shadow">
          چرا خرید از گل فروش
          <Leaf className="w-6 h-6 text-emerald-300" />
        </h2>

        {/* دسکتاپ */}
        <div className="mt-8 hidden md:grid grid-cols-3 gap-6">
          {/* کارت‌های شیشه‌ای مزایا */}
          <div className="md:col-span-2 grid grid-cols-3 gap-6">
            {FEATURES.map(({ title, Icon }) => (
              <div
                key={title}
                className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl ring-1 ring-white/10 shadow-[0_10px_28px_rgba(0,0,0,.25)] p-5 flex items-center justify-between transition hover:bg-white/15"
              >
                <span className="text-[15px] font-semibold text-white/95">
                  {title}
                </span>
                <Icon className="w-8 h-8 text-emerald-300" />
              </div>
            ))}
          </div>

          {/* کارت مشاوره و پشتیبانی با حاشیه گرادیانی */}
          <aside className="relative">
            <div className="rounded-3xl p-[2px] bg-gradient-to-br from-white/50 via-white/30 to-white/50 shadow-[0_18px_45px_rgba(0,0,0,.28)]">
              <div className="rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl ring-1 ring-white/10 p-6 flex flex-col items-center text-center">
                <div className="w-28 h-28 rounded-2xl bg-white/30 ring-1 ring-white/40 backdrop-blur flex items-center justify-center mb-4">
                  <Leaf className="w-10 h-10 text-emerald-600" />
                </div>
                <p className="mb-4 text-white/95 font-semibold">
                  مشاوره و پشتیبانی آنلاین
                </p>
                <Link
                  href="tel:09012764435"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 text-sm font-semibold transition-colors shadow-lg shadow-emerald-600/30"
                >
                  <Phone className="w-4 h-4" />
                  09012764435
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* موبایل: لیست شیشه‌ای عمودی */}
        <div className="md:hidden mt-6 overflow-hidden rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl ring-1 ring-white/10 shadow-[0_10px_28px_rgba(0,0,0,.25)]">
          {FEATURES.map(({ title, Icon }, i) => (
            <div
              key={title}
              className={`flex items-center justify-between px-4 py-4 text-white/95 ${
                i !== 0 ? "border-t border-white/15" : ""
              }`}
            >
              <span className="text-base font-medium">{title}</span>
              <Icon className="w-7 h-7 text-emerald-300" />
            </div>
          ))}
        </div>

        {/* موبایل: دکمه تماس */}
        <div className="md:hidden mt-4">
          <Link
            href="tel:09012764435"
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 text-sm font-semibold transition-colors shadow-lg shadow-emerald-600/30"
          >
            <Phone className="w-4 h-4" />
            09012764435
          </Link>
        </div>
      </div>
    </section>
  );
}
