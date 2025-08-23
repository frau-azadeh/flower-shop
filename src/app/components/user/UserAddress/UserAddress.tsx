"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil } from "lucide-react";
import { toast } from "react-hot-toast";

import { useAddressUrl } from "./useAddressUrl";
import { fetchProfile } from "../../../api/userAddress/api";
import type { ProfileDto } from "@/types/userAddress";

import AddressView from "./AddressView";
import AddressForm from "./AddressForm";

export default function UserAddress() {
  const { isFormOpen, openForm, closeForm } = useAddressUrl();

  const [profile, setProfile] = useState<ProfileDto | null>(null);
  const [loadingProfile, setLoadingProfile] = useState<boolean>(true);

  // بارگیری پروفایل جهت نمایش و پیش‌پر کردن
  useEffect(() => {
    (async () => {
      try {
        setLoadingProfile(true);
        const p = await fetchProfile();
        setProfile(p);
      } catch {
        toast.error("خطا در دریافت اطلاعات پروفایل");
      } finally {
        setLoadingProfile(false);
      }
    })();
  }, []);

  // مقدارهای اولیه‌ی فرم از پروفایل
  const initial = {
    fullName: profile?.fullName ?? "",
    email: profile?.email ?? "",
    phone: profile?.phone ?? "",
    addrLine: profile?.address ?? "",
    province: "",
    city: "",
    postal: "",
  };

  return (
    <section
      dir="rtl"
      className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6 text-right"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-800">آدرس‌ها</h3>

        {!isFormOpen && (
          <button
            onClick={openForm}
            className="inline-flex items-center gap-2 text-accent hover:opacity-90"
          >
            {profile?.address ? (
              <Pencil className="size-5" />
            ) : (
              <Plus className="size-5" />
            )}
            <span>{profile?.address ? "ویرایش آدرس" : "افزودن آدرس جدید"}</span>
          </button>
        )}
      </div>

      <hr className="mb-6 border-slate-200" />

      {!isFormOpen && (
        <AddressView
          loading={loadingProfile}
          profile={profile}
          onEdit={openForm}
        />
      )}

      {isFormOpen && (
        <>
          {loadingProfile ? (
            <div className="mb-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
              در حال بارگذاری اطلاعات…
            </div>
          ) : (
            <AddressForm
              initial={initial}
              onCancel={closeForm}
              onSaved={(payload) => {
                // UI را به‌روز کن و فرم را ببند
                setProfile((prev) => ({
                  id: prev?.id ?? "",
                  fullName: payload.fullName,
                  email: payload.email ?? null,
                  phone: payload.phone,
                  address: payload.address,
                }));
                closeForm();
              }}
            />
          )}
        </>
      )}
    </section>
  );
}
