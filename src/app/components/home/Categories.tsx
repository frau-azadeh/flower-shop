// src/app/components/home/Categories.tsx
import Link from "next/link";
import { Flower2, Leaf, Gift, Sprout } from "lucide-react";
import React from "react";

const CATS: {
  title: string;
  href: string;
  Icon: React.FC<{ className?: string }>;
}[] = [
  { title: "گل شاخه‌ای", href: "/category/stem", Icon: Sprout },
  { title: "دسته‌گل", href: "/category/bouquet", Icon: Flower2 },
  { title: "گلدانی", href: "/category/potted", Icon: Leaf },
  { title: "بسته هدیه", href: "/category/gift", Icon: Gift },
];

export default function Categories() {
  return (
    <section dir="rtl" className="relative bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {CATS.map(({ title, href, Icon }) => (
            <Link
              key={href}
              href={href}
              aria-label={title}
              className="
                group relative overflow-hidden rounded-2xl p-[2px]
                bg-gradient-to-br from-white/60 via-white/35 to-white/60
                ring-1 ring-white/30 shadow-[0_8px_22px_rgba(0,0,0,.06)]
                transition-transform hover:-translate-y-0.5
              "
            >
              {/* کارت شیشه‌ای داخل حاشیه گرادیانی */}
              <div
                className="
                  flex items-center justify-between gap-3
                  rounded-[14px] bg-white/60 backdrop-blur-md
                  px-4 py-3 ring-1 ring-white/40
                "
              >
                <div className="flex items-center gap-3">
                  {/* قرص آیکن با هاله‌ی نور لطیف */}
                  <span
                    className="
                      relative grid size-10 place-items-center rounded-xl
                      bg-gradient-to-br from-amber-100 via-yellow-50 to-amber-100
                      ring-1 ring-amber-200/50
                      shadow-[0_6px_18px_rgba(251,191,36,.25)]
                      transition-shadow group-hover:shadow-[0_10px_24px_rgba(251,191,36,.35)]
                    "
                  >
                    <Icon className="size-5 text-accent" />
                    {/* های‌لایت شیشه‌ای کوچک در گوشه‌ی بالا-چپ */}
                    <span className="pointer-events-none absolute inset-0 rounded-xl bg-[radial-gradient(18px_18px_at_25%_20%,rgba(255,255,255,.55),transparent_60%)]" />
                  </span>

                  <span className="font-bold text-slate-800">{title}</span>
                </div>

                {/* فلش نرم روی هاور */}
                <svg
                  className="
                    me-1 size-4 text-slate-400 transition
                    opacity-0 -translate-x-1 group-hover:translate-x-0 group-hover:opacity-100
                  "
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {/* چون rtl است، فلش به سمت چپ */}
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </div>

              {/* های‌لایت عبوری (beam) هنگام هاور */}
              <span
                className="
                  pointer-events-none absolute -left-1/2 top-0 h-full w-[200%] -skew-x-12
                  bg-gradient-to-r from-transparent via-white/35 to-transparent
                  opacity-0 group-hover:opacity-100 transition duration-700
                "
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
