"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase";
import ScrollToTop from "@/app/components/ui/ScrollToTop";
import UserFooter from "@/app/components/user/UserFooter";
import UserNavbar from "@/app/components/user/UserNavbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createSupabaseClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push("/auth/login");
      } else {
        setLoading(false);
      }
    });
  }, []);

  if (loading) return null; // یا یک لودر بگذار

  return (
    <div className="bg-background">
      <div className="min-h-screen grid grid-cols-1 md:grid-cols-[240px_1fr]">
        <UserNavbar />
        <main className="p-4 md:p-6">{children}</main>
      </div>
      <ScrollToTop />
      <UserFooter />
    </div>
  );
}
