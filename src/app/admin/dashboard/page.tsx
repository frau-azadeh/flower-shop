// app/admin/dashboard/page.tsx
"use client";

import RequireAuth from "@/app/components/admin/RequireAuth";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

export default function DashboardPage() {
  return (
    <RequireAuth allow={["FULL","BLOG","PRODUCTS"]}>
        <DashboardContent />
    </RequireAuth>
  );
}

function DashboardContent() {
  const { role } = useSelector((s: RootState) => s.admin);
  if (role === "BLOG") {
    return (
      <div className="space-y-3">
        <h1 className="text-xl font-bold">داشبورد وبلاگ</h1>
        <p className="text-sm text-slate-600">می‌توانید پست‌هایتان را مدیریت کنید.</p>
      </div>
    );
  }
  if (role === "PRODUCTS") {
    return (
      <div className="space-y-3">
        <h1 className="text-xl font-bold">داشبورد محصولات</h1>
        <p className="text-sm text-slate-600">مدیریت محصولات و سفارش‌ها از اینجا.</p>
      </div>
    );
  }
  // FULL
  return (
    <div className="space-y-3">
      <h1 className="text-xl font-bold">داشبورد ادمین کامل</h1>
      <p className="text-sm text-slate-600">همه بخش‌ها در دسترس شماست.</p>
    </div>
  );
}
