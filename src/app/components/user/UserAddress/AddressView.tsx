"use client";

import { MapPin, Pencil } from "lucide-react";
import type { ProfileDto } from "./types";

type Props = {
  loading: boolean;
  profile: ProfileDto | null;
  onEdit: () => void;
};

export default function AddressView({ loading, profile, onEdit }: Props) {
  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
        در حال بارگذاری…
      </div>
    );
  }

  if (profile?.address) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="mb-3 flex items-center gap-2">
          <MapPin className="size-5 text-accent" />
          <h4 className="font-semibold">آدرس ثبت‌شده</h4>
        </div>

        <div className="grid gap-1 text-sm text-slate-700">
          <div>
            <span className="text-slate-500">نام: </span>
            {profile.fullName ?? "—"}
          </div>
          <div>
            <span className="text-slate-500">ایمیل: </span>
            {profile.email ?? "—"}
          </div>
          <div>
            <span className="text-slate-500">تلفن: </span>
            {profile.phone ?? "—"}
          </div>
          <div>
            <span className="text-slate-500">نشانی: </span>
            {profile.address}
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={onEdit}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm hover:bg-slate-50"
          >
            <Pencil className="size-4" />
            ویرایش آدرس
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <MapPin className="size-24 text-slate-300" />
      <p className="mt-6 text-sm md:text-base text-slate-700">
        هنوز هیچ آدرسی ثبت نکرده‌اید.
      </p>
      <button
        onClick={onEdit}
        className="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm hover:bg-slate-50"
      >
        افزودن آدرس جدید
      </button>
    </div>
  );
}
