"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupSchema } from "@/schemas/auth.schema";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";
import { createSupabaseClient } from "@/lib/supabase";
import { UserRound, Phone, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { showSuccess, showError } from "@/lib/toast";
import PasswordStrengthMeter from "@/app/components/ui/PasswordStrengthMeter";
import React from "react";

export default function SignupPage() {
  const supabase = React.useMemo(() => createSupabaseClient(), []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });

  const router = useRouter();
  const passwordValue = watch("password");

  const onSubmit = async (data: SignupSchema) => {
    const { fullName, phone, email, password } = data;

    try {
      // ثبت‌نام با شماره موبایل
      const { data: signUpData, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw new Error(error.message);

      if (signUpData.user) {
        // ذخیره اطلاعات در جدول profiles
        const { error: profileError } = await supabase.from("profiles").insert({
          id: signUpData.user.id,
          fullName: fullName,
          phone,
          email,
        });

        if (profileError) throw new Error(profileError.message);

        showSuccess("ثبت‌نام موفقیت‌آمیز بود! لطفاً وارد شوید.");
        router.push("/auth/login");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        showError(err.message);
      } else {
        showError("خطای ناشناخته‌ای رخ داد.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm space-y-4"
      >
        <h2 className="text-xl font-bold text-center">ثبت‌نام کاربر جدید</h2>

        <Input
          label="نام و نام خانوادگی"
          icon={<UserRound size={18} />}
          {...register("fullName")}
          error={errors.fullName?.message}
        />

        <Input
          label="شماره موبایل"
          type="tel"
          icon={<Phone size={18} />}
          {...register("phone")}
          error={errors.phone?.message}
        />

        <Input
          label="ایمیل"
          type="email"
          icon={<Mail size={18} />}
          {...register("email")}
          error={errors.email?.message}
        />

        <Input
          label="رمز عبور"
          type="password"
          togglePassword
          {...register("password")}
          error={errors.password?.message}
        />

        <PasswordStrengthMeter password={passwordValue} />

        <Input
          label="تکرار رمز عبور"
          type="password"
          togglePassword
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />

        <Button type="submit" loading={isSubmitting} className="w-full">
          ثبت‌نام
        </Button>

        <p className="text-sm text-center text-gray-600">
          قبلاً ثبت‌نام کرده‌اید؟{" "}
          <Link
            href="/auth/login"
            className="text-blue-600 hover:underline font-medium"
          >
            وارد شوید
          </Link>
        </p>
      </form>
    </div>
  );
}
