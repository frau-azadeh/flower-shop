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
    <section className="bg-white w-full bg-surface border border-border ">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 md:pt-14 pb-24 md:pb-32">
        {/* عنوان */}
        <h2 className="flex items-center justify-center gap-2 text-center text-2xl md:text-3xl font-extrabold text-primary">
          چرا خرید از گل فروش
          <Leaf className="w-6 h-6 text-accent" />
        </h2>

        {/* دسکتاپ: گرید + کارت مشاوره */}
        <div className="mt-8 hidden md:grid grid-cols-3 gap-6">
          <div className="md:col-span-2 grid grid-cols-3 gap-6">
            {FEATURES.map(({ title, Icon }) => (
              <div
                key={title}
                className="rounded-2xl border border-border bg-surface shadow-sm p-5 flex items-center justify-between"
              >
                <span className="text-base font-semibold text-text">
                  {title}
                </span>
                <Icon className="w-8 h-8 text-accent" />
              </div>
            ))}
          </div>

          {/* کارت مشاوره و پشتیبانی */}
          <aside className="rounded-2xl border border-border bg-surface shadow-sm p-6 flex flex-col items-center text-center">
            {/* جای لوگو (دلخواه) */}
            <div className="w-28 h-28 rounded-xl bg-muted flex items-center justify-center mb-4">
              <Leaf className="w-10 h-10 text-primary" />
            </div>
            <p className="mb-4 text-text font-semibold">
              مشاوره و پشتیبانی آنلاین
            </p>
            <Link
              href="tel:09012764435"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-hover text-white px-5 py-3 text-sm font-semibold transition-colors"
            >
              <Phone className="w-4 h-4" />
              09012764435
            </Link>
          </aside>
        </div>

        {/* موبایل: لیست عمودی شبیه اسکرین‌شات */}
        <div className="md:hidden mt-6 rounded-2xl overflow-hidden border border-border bg-surface shadow-sm">
          {FEATURES.map(({ title, Icon }, i) => (
            <div
              key={title}
              className={`flex items-center justify-between px-4 py-4 ${i !== 0 ? "border-t border-border" : ""}`}
            >
              <span className="text-base font-medium text-text">{title}</span>
              <Icon className="w-7 h-7 text-accent" />
            </div>
          ))}
        </div>

        {/* موبایل: دکمه مشاوره زیر لیست */}
        <div className="md:hidden mt-4">
          <Link
            href="tel:09012764435"
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-hover text-white px-5 py-3 text-sm font-semibold transition-colors"
          >
            <Phone className="w-4 h-4" />
            09012764435
          </Link>
        </div>
      </div>
    </section>
  );
}
