// app/admin/page.tsx
"use client";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import type { RootState } from "@/store/store";

export default function AdminIndex() {
  const { isAuthenticated } = useSelector((s: RootState) => s.admin);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.replace("/admin-login");
    else router.replace("/admin/dashboard");
  }, [isAuthenticated, router]);

  return null;
}
