"use client";

import dynamic from "next/dynamic";
import RequireAuth from "@/app/components/admin/RequireAuth";

// PostEditor خودش از RichText ایمپورت می‌گیرد؛ نیازی نیست prop بدهی
const PostEditor = dynamic(() => import("@/app/components/admin/PostEditor"), {
  ssr: false,
  loading: () => (
    <div className="border rounded p-3">در حال بارگذاری ادیتور…</div>
  ),
});

export default function AdminBlogClient() {
  return (
    <RequireAuth allow={["BLOG", "FULL"]}>
      <PostEditor />
    </RequireAuth>
  );
}
