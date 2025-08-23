"use client";

import dynamic from "next/dynamic";
import RequireAuth from "@/app/components/admin/RequireAuth";

const PostEditor = dynamic(() => import("@/app/components/admin/PostEditor"), {
  ssr: false,
  loading: () => <div className="rounded border p-3">در حال بارگذاری ادیتور…</div>,
});

export default function AdminBlogClient() {
  return (
    <RequireAuth allow={["BLOG", "FULL"]}>
      <PostEditor />
    </RequireAuth>
  );
}
