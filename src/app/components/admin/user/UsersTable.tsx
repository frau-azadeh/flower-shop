"use client";

import type { AdminUser } from "@/types/admin";
import { Pencil, Trash2, Users } from "lucide-react";

export default function UsersTable({
  items,
  loading,
  onEdit,
  onDelete,
}: {
  items: AdminUser[];
  loading: boolean;
  onEdit: (u: AdminUser) => void;
  onDelete: (id: string) => void;
}) {
  if (loading)
    return <div className="py-10 text-center text-sm">در حال بارگذاری…</div>;
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center py-12 text-slate-600">
        <Users className="size-12 text-slate-300" />
        <div className="mt-2 text-sm">هنوز کاربری ثبت نشده است.</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-slate-600">
          <tr className="[&>th]:py-2 [&>th]:text-right">
            <th>نام</th>
            <th>نقش</th>
            <th>وضعیت</th>
            <th className="text-center">عملیات</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {items.map((u) => (
            <tr key={u.id}>
              <td className="py-2">
                {u.firstName} {u.lastName}
              </td>
              <td className="py-2">
                {u.role === "FULL"
                  ? "کامل"
                  : u.role === "BLOG"
                    ? "وبلاگ"
                    : "محصولات"}
              </td>
              <td className="py-2">{u.isActive ? "فعال" : "غیرفعال"}</td>
              <td className="py-2">
                <div className="flex justify-center gap-2">
                  <button
                    className="rounded border px-2 py-1"
                    onClick={() => onEdit(u)}
                    title="ویرایش"
                  >
                    <Pencil className="size-4" />
                  </button>
                  <button
                    className="rounded border px-2 py-1 text-red-600"
                    onClick={() => onDelete(u.id)}
                    title="حذف"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
