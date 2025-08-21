// app/admin/login/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { setAdmin } from "@/store/admin/adminSlice";
import {
  adminLoginSchema,
  type AdminLoginSchema,
} from "@/schemas/admin-auth.schema";
import { loginAdmin } from "./actions";
import { homePathByRole } from "@/lib/adminRoutes";

export default function AdminLoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginSchema>({
    resolver: zodResolver(adminLoginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: AdminLoginSchema) => {
    const res = await loginAdmin(data);
    if (!res.ok) {
      alert(res.message);
      return;
    }

    // سشن ادمین را ست کن (کوکی)
    await fetch("/api/admin/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ adminId: res.user.id }),
    });

    // استور کلاینتی (اختیاری)
    dispatch(setAdmin(res.user));

    // مقصد: اگر redirect امن بود همان؛ وگرنه خانه‌ی نقش
    const raw = search.get("redirect") ?? "";
    const target = decodeURIComponent(raw);
    const isSafe = target.startsWith("/admin");
    router.replace(isSafe ? target : homePathByRole(res.user.role));
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm space-y-4"
      >
        <h2 className="text-xl font-bold text-center">ورود ادمین</h2>

        <div className="space-y-1">
          <label className="text-sm">نام</label>
          <input
            className="w-full border rounded-md px-3 py-2"
            {...register("firstName")}
            placeholder="مثلاً علی"
          />
          {errors.firstName && (
            <p className="text-red-600 text-xs">{errors.firstName.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm">نام خانوادگی</label>
          <input
            className="w-full border rounded-md px-3 py-2"
            {...register("lastName")}
            placeholder="مثلاً رضایی"
          />
          {errors.lastName && (
            <p className="text-red-600 text-xs">{errors.lastName.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm">رمز عبور</label>
          <input
            type="password"
            className="w-full border rounded-md px-3 py-2"
            {...register("password")}
            placeholder="******"
          />
          {errors.password && (
            <p className="text-red-600 text-xs">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-primary text-white py-2 disabled:opacity-70"
        >
          {isSubmitting ? "در حال ورود..." : "ورود"}
        </button>
      </form>
    </div>
  );
}
