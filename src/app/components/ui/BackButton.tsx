// src/app/components/ui/BackButton.tsx
"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const SCROLL_SHOW_PX = 100; 

export default function BackButton() {
  const pathname = usePathname();
  const router = useRouter();

  const [hasNavigated, setHasNavigated] = useState(false);

  const [visibleByScroll, setVisibleByScroll] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const keyEntry = "gf_entry_path";        
    const keyNav   = "gf_has_navigated";    

    if (!sessionStorage.getItem(keyEntry)) {
      sessionStorage.setItem(keyEntry, window.location.pathname);
    }

    const entryPath = sessionStorage.getItem(keyEntry);
    const navigated = entryPath && pathname !== entryPath;
    setHasNavigated(!!navigated);
    sessionStorage.setItem(keyNav, navigated ? "1" : "0");

    const onScroll = () => setVisibleByScroll(window.scrollY > SCROLL_SHOW_PX);
    onScroll(); 
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  const onBack = () => {
    if (typeof window === "undefined") return;
    if (window.history.length > 1) router.back();
    else router.push("/");
  };

  if (!hasNavigated) return null;

  return (
    <button
      onClick={onBack}
      aria-label="صفحه قبل"
      className={`fixed left-4 bottom-50 z-50 rounded-xl bg-primary px-3 py-2
                  text-white shadow-lg ring-1 ring-black/10 transition-opacity duration-300
                  ${visibleByScroll ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      صفحه قبل
    </button>
  );
}
