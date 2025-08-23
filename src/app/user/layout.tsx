"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase";
import ScrollToTop from "@/app/components/ui/ScrollToTop";
import UserFooter from "@/app/components/user/UserFooter";
import UserNavbar from "@/app/components/user/UserNavbar";

import { Toaster } from "react-hot-toast";
import ConfirmTracer from "../components/dev/ConfirmTracer";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const supabase = createSupabaseClient();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        const current = `${pathname}${params.toString() ? `?${params}` : ""}`;
        if (!cancelled) {
          router.replace(`/auth/login?redirect=${encodeURIComponent(current)}`);
        }
        return;
      }
      if (!cancelled) setLoading(false);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_ev, session) => {
      if (!session) {
        const current = `${pathname}${params.toString() ? `?${params}` : ""}`;
        router.replace(`/auth/login?redirect=${encodeURIComponent(current)}`);
      } else {
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
      sub.subscription?.unsubscribe();
    };
    // عمداً dependency روی supabase.auth نمی‌گذاریم
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, pathname, params, supabase]);

  if (loading) return null;

  return (
    <div className="bg-background">
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[280px_1fr]">
        <UserNavbar />
        <main className="p-4 md:p-6">{children}</main>
      </div>
      <Toaster position="top-center" />
      {process.env.NODE_ENV !== "production" && <ConfirmTracer />}
      <ScrollToTop />
      <UserFooter />
    </div>
  );
}
