// src/app/components/home/Hero.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Phone,
  ChevronLeft,
  ChevronRight,
  BadgeCheck,
  Truck,
  ShieldCheck,
  Sparkles,
  Gift,
  Leaf,
  Clock,
} from "lucide-react";

type Slide = { src: string; alt: string };

const SLIDES: Slide[] = [
  {
    src: "https://usiucooivlxwnqnjqstb.supabase.co/storage/v1/object/public/blog-covers/calla-lily/cover.jfif",
    alt: "Calla Lily",
  },
  {
    src: "https://usiucooivlxwnqnjqstb.supabase.co/storage/v1/object/public/blog-covers/azalea/cover.jfif",
    alt: "Azalea",
  },
  {
    src: "https://usiucooivlxwnqnjqstb.supabase.co/storage/v1/object/public/product-covers/lithops-1755529988518.jpg",
    alt: "Lithops",
  },
];

const AUTOPLAY_MS = 6000;

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hidden, setHidden] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    const onVis = () => setHidden(document.hidden);
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    if (paused || hidden) return;
    if (timer.current) window.clearInterval(timer.current);
    timer.current = window.setInterval(
      () => setIndex((i) => (i + 1) % SLIDES.length),
      AUTOPLAY_MS
    );
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [paused, hidden]);

  const next = () => setIndex((i) => (i + 1) % SLIDES.length);
  const prev = () => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length);

  const features = [
    { icon: Truck, label: "ارسال همان‌روز" },
    { icon: ShieldCheck, label: "ضمانت کیفیت" },
    { icon: Sparkles, label: "همیشه تازه" },
    { icon: Gift, label: "بسته‌بندی هدیه" },
    { icon: Leaf, label: "دوست هوای پاک" },
    { icon: Clock, label: "پشتیبانی 24/7" },
  ] as const;

  return (
    <section
      dir="rtl"
      className="relative isolate overflow-hidden py-12 md:py-16"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* === Background from /public/images.jfif + overlays === */}
      <div
        className="absolute inset-0 -z-30 bg-cover bg-center"
        style={{ backgroundImage: "url('/images.jfif')" }}
        aria-hidden
      />
      {/* نرم‌کننده رنگ/کنتراست */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-black/40 via-emerald-900/25 to-black/45" />
      {/* blobهای لطیف برای عمق بصری */}
      <div className="absolute -left-16 -top-10 h-72 w-72 rounded-full bg-emerald-400/25 blur-3xl animate-blob -z-10" />
      <div className="absolute right-8 -top-10 h-64 w-64 rounded-full bg-sky-400/20 blur-3xl animate-blob animation-delay-2000 -z-10" />
      <div className="absolute left-1/2 bottom-0 h-80 w-80 -translate-x-1/2 rounded-full bg-teal-300/20 blur-3xl animate-blob animation-delay-4000 -z-10" />
      {/* beam ملایم */}
      <div className="absolute inset-y-8 -left-1/3 w-[160%] -rotate-12 bg-gradient-to-r from-transparent via-emerald-300/25 to-transparent blur-3xl animate-shine -z-10" />
      {/* تکسچر گرید خیلی ظریف */}
      <div className="absolute inset-0 opacity-[.06] mix-blend-overlay -z-10 [background:repeating-linear-gradient(0deg,rgba(255,255,255,.7),rgba(255,255,255,.7)_1px,transparent_1px,transparent_14px),repeating-linear-gradient(90deg,rgba(255,255,255,.7),rgba(255,255,255,.7)_1px,transparent_1px,transparent_14px)]" />
      {/* vignette برای تمرکز چشم */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(75%_75%_at_50%_40%,transparent,rgba(0,0,0,0.35))]" />

      {/* === Content === */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="min-h-[540px] md:min-h-[620px] flex items-center">
          {/* gradient border -> glass card */}
          <div className="w-full rounded-[36px] bg-gradient-to-b from-white/25 to-white/10 p-[1.5px] shadow-[0_22px_80px_rgba(0,0,0,.25)]">
            <div className="rounded-[28px] border border-white/15 bg-white/10 p-5 md:p-8 backdrop-blur-xl ring-1 ring-white/40 shadow-[0_10px_28px_rgba(56,189,248,.18)]">
              <div className="px-8 md:px-12 py-10 md:py-14">
                <div className="grid items-center gap-10 md:grid-cols-2 md:gap-12">
                  {/* Text side */}
                  <div>
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-[12px] font-semibold text-emerald-700 shadow">
                      <BadgeCheck className="size-4" />
                      تاز‌ه‌چینی • ارسال سریع • تضمین کیفیت
                    </span>

                    <h1 className="mt-4 text-4xl md:text-6xl font-extrabold leading-tight tracking-tight text-white drop-shadow">
                      سفارش آنلاین گل‌های{" "}
                      <span className="bg-gradient-to-l from-emerald-300 to-teal-100 bg-clip-text text-transparent">
                        تازه و خاص
                      </span>
                    </h1>

                    <p className="mt-5 max-w-xl text-white/90 md:text-lg leading-8">
                      از دسته‌گل‌های خاص تا گل‌های شاخه‌ای، با قیمت رقابتی و ارسال همان‌روز.
                      انتخاب کن و لحظه‌ها رو قشنگ‌تر کن.
                    </p>

                    {/* CTA buttons */}
                    <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                      <Link
                        href="/products"
                        className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:scale-[1.02] hover:bg-emerald-600"
                      >
                        <ShoppingBag className="ms-2 size-4" />
                        مشاهده محصولات
                      </Link>
                      <Link
                        href="tel:09012764435"
                        className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/85 px-6 py-3 font-semibold text-emerald-700 backdrop-blur transition-all hover:bg-white"
                      >
                        <Phone className="ms-2 size-4" />
                        09012764435
                      </Link>
                    </div>

                    {/* Feature icons grid */}
                    <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {features.map(({ icon: Icon, label }) => (
                        <li
                          key={label}
                          className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-white/95 backdrop-blur transition hover:bg-white/15"
                        >
                          <Icon className="size-[18px] text-emerald-300" />
                          <span className="text-sm">{label}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Slider side */}
                  <div className="relative flex flex-col items-stretch">
                    <button
                      aria-label="قبلی"
                      onClick={prev}
                      className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/95 p-2 text-gray-800 shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-white/60"
                    >
                      <ChevronRight className="size-6" />
                    </button>
                    <button
                      aria-label="بعدی"
                      onClick={next}
                      className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/95 p-2 text-gray-800 shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-white/60"
                    >
                      <ChevronLeft className="size-6" />
                    </button>

                    <div className="relative w-full overflow-hidden rounded-3xl border border-white/15 shadow-2xl aspect-[16/11] will-change-transform">
                      {SLIDES.map((s, i) => (
                        <figure
                          key={s.src}
                          className={[
                            "absolute inset-0 transition-opacity duration-[900ms] ease-out",
                            i === index ? "opacity-100" : "opacity-0",
                          ].join(" ")}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={s.src}
                            alt={s.alt}
                            className="h-full w-full object-cover"
                            loading="eager"
                          />
                          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(40%_40%_at_90%_10%,rgba(255,255,255,.14),transparent_60%)]" />
                          <figcaption className="pointer-events-none absolute bottom-3 left-3 rounded-lg bg-black/35 px-3 py-1 text-xs text-white backdrop-blur">
                            {s.alt}
                          </figcaption>
                        </figure>
                      ))}
                    </div>

                    <div className="mt-3 flex justify-center gap-2">
                      {SLIDES.map((_, i) => (
                        <button
                          key={i}
                          aria-label={`اسلاید ${i + 1}`}
                          onClick={() => setIndex(i)}
                          className={[
                            "h-2.5 w-2.5 rounded-full border border-white/80 transition",
                            i === index ? "bg-white" : "bg-white/40 hover:bg-white/70",
                          ].join(" ")}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* /glass card */}
        </div>
      </div>

      {/* animations (blobs / beam) */}
      <style jsx>{`
        .animate-blob {
          animation: blob 16s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes blob {
          0%,
          100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(18px, -28px) scale(1.06);
          }
          66% {
            transform: translate(-22px, 14px) scale(0.96);
          }
        }
        .animate-shine {
          animation: shine 9s linear infinite;
        }
        @keyframes shine {
          0% {
            transform: translateX(-10%) rotate(-12deg);
          }
          50% {
            transform: translateX(10%) rotate(-12deg);
          }
          100% {
            transform: translateX(-10%) rotate(-12deg);
          }
        }
      `}</style>
    </section>
  );
}
