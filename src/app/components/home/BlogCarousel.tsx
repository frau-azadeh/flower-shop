// src/app/components/home/BlogCarousel.tsx
"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { BlogItem } from "./BlogPreview";

type Props = { items: BlogItem[]; intervalMs?: number };

function formatDateFa(iso?: string | null) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(d);
}

function estimateReadMins(content?: string | null) {
  if (!content) return null;
  const txt = content
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!txt) return null;
  const words = txt.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 180));
}

export default function BlogCarousel({ items, intervalMs = 3500 }: Props) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [offsets, setOffsets] = useState<number[]>([]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const dir = "ltr";

  const computeOffsets = () => {
    const el = viewportRef.current;
    if (!el) return;
    const kids = Array.from(el.children) as HTMLElement[];
    setOffsets(kids.map((k) => k.offsetLeft));
  };

  useEffect(() => {
    computeOffsets();
    const ro = new ResizeObserver(() => computeOffsets());
    if (viewportRef.current) ro.observe(viewportRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const x = el.scrollLeft;
        if (!offsets.length) return;
        let best = 0;
        let bestD = Math.abs(x - offsets[0]);
        for (let i = 1; i < offsets.length; i++) {
          const d = Math.abs(x - offsets[i]);
          if (d < bestD) {
            best = i;
            bestD = d;
          }
        }
        setIndex(best);
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [offsets]);

  // ✅ پایدار کردن goTo
  const goTo = useCallback(
    (i: number) => {
      const el = viewportRef.current;
      if (!el || !offsets.length) return;
      const next = (i + offsets.length) % offsets.length;
      el.scrollTo({ left: offsets[next], behavior: "smooth" });
      setIndex(next);
    },
    [offsets],
  );

  // ✅ استفاده از const برای تایمر + افزودن goTo به deps
  useEffect(() => {
    if (paused || !offsets.length) return;
    const timerId = window.setInterval(() => {
      if (document.hidden) return;
      goTo(index + 1);
    }, intervalMs);
    return () => window.clearInterval(timerId);
  }, [index, paused, offsets.length, intervalMs, goTo]);

  const cards = useMemo(
    () =>
      items.map((p) => {
        const date = formatDateFa(p.created_at);
        const mins = estimateReadMins(p.content);
        return (
          <Link
            key={p.id}
            href={`/blog/${p.slug}`}
            className="snap-start shrink-0 basis-[86%] sm:basis-[58%] lg:basis-[33%] xl:basis-[25%] rounded-2xl border border-border bg-white shadow-sm transition hover:shadow-lg"
            dir="rtl"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-b-none rounded-t-2xl bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={p.title}
                src={
                  p.coverUrl ||
                  "https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?q=80&w=1200&auto=format&fit=crop"
                }
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
              {(date || mins) && (
                <div className="absolute bottom-2 left-2 flex items-center gap-2 rounded-full bg-black/55 px-3 py-1 text-[11px] text-white backdrop-blur-sm">
                  {date && <span>{date}</span>}
                  {date && mins ? <span>•</span> : null}
                  {mins ? <span>{mins} دقیقه مطالعه</span> : null}
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="line-clamp-1 text-base font-bold text-slate-800">
                {p.title}
              </h3>
              {p.excerpt && (
                <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-600">
                  {p.excerpt}
                </p>
              )}
              <div className="mt-3 text-xs text-primary/70">ادامه مطلب ←</div>
            </div>
          </Link>
        );
      }),
    [items],
  );

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-background to-transparent" />

      <div
        ref={viewportRef}
        dir={dir}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory px-1 pb-2 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="اسلایدر پست‌های وبلاگ"
      >
        {cards}
      </div>

      <button
        type="button"
        onClick={() => goTo(index - 1)}
        aria-label="قبلی"
        className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full border border-border bg-white/90 p-2 shadow hover:bg-white"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => goTo(index + 1)}
        aria-label="بعدی"
        className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full border border-border bg-white/90 p-2 shadow hover:bg-white"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <div className="mt-3 flex items-center justify-center gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`اسلاید ${i + 1}`}
            onClick={() => goTo(i)}
            className={`h-2.5 w-2.5 rounded-full transition ${
              i === index ? "bg-primary" : "bg-slate-300 hover:bg-slate-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
