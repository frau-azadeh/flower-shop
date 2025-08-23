"use client";

import { useEffect } from "react";
import { Save, X, MapPin } from "lucide-react";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { saveProfile } from "../../../api/userAddress/api";
import {
  AddressSchema,
  type AddressFormValues,
  composeAddress,
} from "@/schemas/userAddressSchema";

type Initial = {
  fullName: string;
  email: string;
  phone: string;
  addrLine: string;
  province?: string;
  city?: string;
  postal?: string;
};

type Props = {
  initial: Initial;
  onCancel: () => void;
  onSaved: (payload: {
    fullName: string;
    email?: string;
    phone: string;
    address: string;
  }) => void;
};

export default function AddressForm({ initial, onCancel, onSaved }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AddressFormValues>({
    resolver: zodResolver(AddressSchema),
    defaultValues: {
      fullName: initial.fullName,
      email: initial.email,
      phone: initial.phone,
      province: initial.province ?? "",
      city: initial.city ?? "",
      addrLine: initial.addrLine,
      postal: initial.postal ?? "",
    },
  });

  // سینک شدن مقدارهای اولیه با فرم
  useEffect(() => {
    reset({
      fullName: initial.fullName,
      email: initial.email,
      phone: initial.phone,
      province: initial.province ?? "",
      city: initial.city ?? "",
      addrLine: initial.addrLine,
      postal: initial.postal ?? "",
    });
  }, [initial, reset]);

  const onSubmit = handleSubmit(async (values) => {
    const payload = {
      fullName: values.fullName.trim(),
      email: values.email?.trim() || undefined,
      phone: values.phone.trim(),
      address: composeAddress(values).trim(),
    };

    try {
      await saveProfile(payload); // API بدون تغییر
      toast.success("با موفقیت ذخیره شد.");
      onSaved(payload);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "خطا در ثبت اطلاعات";
      toast.error(msg);
    }
  });

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="size-5 text-accent" />
          <h4 className="font-semibold">افزودن / ویرایش آدرس</h4>
        </div>
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-700"
        >
          <X className="size-5" />
          بستن
        </button>
      </div>

      <form className="space-y-4" onSubmit={onSubmit} noValidate>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* نام */}
          <label className="block">
            <span className="mb-1 block text-xs text-slate-600">
              نام و نام خانوادگی
            </span>
            <input
              {...register("fullName")}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
            {errors.fullName && (
              <span className="mt-1 block text-[11px] text-rose-600">
                {errors.fullName.message}
              </span>
            )}
          </label>

          {/* ایمیل */}
          <label className="block">
            <span className="mb-1 block text-xs text-slate-600">ایمیل</span>
            <input
              {...register("email")}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
            {errors.email && (
              <span className="mt-1 block text-[11px] text-rose-600">
                {errors.email.message}
              </span>
            )}
          </label>

          {/* تلفن */}
          <label className="block">
            <span className="mb-1 block text-xs text-slate-600">
              شماره تماس
            </span>
            <input
              {...register("phone")}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
            {errors.phone && (
              <span className="mt-1 block text-[11px] text-rose-600">
                {errors.phone.message}
              </span>
            )}
          </label>

          {/* استان */}
          <label className="block">
            <span className="mb-1 block text-xs text-slate-600">استان</span>
            <input
              {...register("province")}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </label>

          {/* شهر */}
          <label className="block">
            <span className="mb-1 block text-xs text-slate-600">شهر</span>
            <input
              {...register("city")}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </label>

          {/* آدرس دقیق */}
          <label className="block md:col-span-2">
            <span className="mb-1 block text-xs text-slate-600">آدرس دقیق</span>
            <textarea
              rows={3}
              {...register("addrLine")}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
            {errors.addrLine && (
              <span className="mt-1 block text-[11px] text-rose-600">
                {errors.addrLine.message}
              </span>
            )}
          </label>

          {/* کد پستی */}
          <label className="block md:col-span-2 md:max-w-xs">
            <span className="mb-1 block text-xs text-slate-600">کد پستی</span>
            <input
              {...register("postal")}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </label>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-white hover:opacity-90 disabled:opacity-60"
          >
            <Save className="size-5" />
            {isSubmitting ? "در حال ذخیره…" : "ذخیره آدرس"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50"
          >
            انصراف
          </button>
        </div>
      </form>
    </div>
  );
}
