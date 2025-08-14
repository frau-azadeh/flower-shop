"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  adminLoginSchema,
  type AdminLoginSchema,
} from "@/schemas/admin-auth.schema";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setAdmin } from "@/store/admin/adminSlice";
import { loginAdmin } from "./actions";
import { homePathByRole } from "@/lib/adminRoutes";

export default function AdminLoginPage() {
  const router = useRouter();
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
    dispatch(
      setAdmin({
        id: res.user.id,
        firstName: res.user.firstName,
        lastName: res.user.lastName,
        role: res.user.role,
      }),
    );
    router.push(homePathByRole(res.user.role));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm space-y-4"
      >
        <h2 className="text-xl font-bold text-center">ورود ادمین</h2>

        <div className="space-y-1">
          <label className="text-sm">نام</label>
          <input
            className="w-full border rounded-md px-3 py-2 outline-none focus:ring"
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
            className="w-full border rounded-md px-3 py-2 outline-none focus:ring"
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
            className="w-full border rounded-md px-3 py-2 outline-none focus:ring"
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
          className="w-full rounded-md bg-blue-600 text-white py-2 font-medium disabled:opacity-70"
        >
          {isSubmitting ? "در حال ورود..." : "ورود"}
        </button>
      </form>
    </div>
  );
}
