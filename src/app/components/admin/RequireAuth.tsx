"use client";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import type { RootState } from "@/store/store";
import type { AdminRole } from "@/types/admin";

export default function RequireAuth({
  allow,
  children,
}: {
  allow: AdminRole[]; // مثلا ["FULL"] یا ["BLOG","FULL"]
  children: ReactNode;
}) {
  const router = useRouter();
  const admin = useSelector((s: RootState) => s.admin);

  useEffect(() => {
    if (!admin.isAuthenticated) router.replace("/admin-login");
    else if (!allow.includes(admin.role!)) router.replace("/admin");
  }, [admin.isAuthenticated, admin.role, allow, router]);

  if (!admin.isAuthenticated || !allow.includes(admin.role!)) return null;
  return <>{children}</>;
}
