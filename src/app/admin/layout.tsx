"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase";
import ScrollToTop from "@/app/components/ui/ScrollToTop";
import UserFooter from "@/app/components/user/UserFooter";
import UserNavbar from "@/app/components/user/UserNavbar";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const supabase = createSupabaseClient();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        const current = `${window.location.pathname}${window.location.search}`;
        router.push(`/auth/login?redirect=${encodeURIComponent(current)}`); // ⬅️ مسیر فعلی حفظ شود
      } else {
        setLoading(false);
      }
    });
  }, [router, supabase.auth]);

  if (loading) return null;

  return (
    <div className="bg-background">
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[280px_1fr]">
        <UserNavbar />
        <main className="p-4 md:p-6">{children}</main>
      </div>
      <ScrollToTop />
      <UserFooter />
    </div>
  );
}
