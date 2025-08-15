"use client";

import { Users } from "lucide-react";

export function EmptyUsers() {
  return (
    <div className="flex flex-col items-center justify-center py-6 text-center">
      <Users className="size-14 text-slate-300" />
      <p className="mt-3 text-sm md:text-base text-slate-700">
        هنوز کاربری ثبت نشده است.
      </p>
      <p className="mt-1 text-xs text-slate-500">
        از دکمه «افزودن کاربر» استفاده کنید.
      </p>
    </div>
  );
}
