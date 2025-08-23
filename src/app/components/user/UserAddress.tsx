"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MapPin, Plus, X, Save, Pencil } from "lucide-react";

/* ------------ Types ------------ */
type ProfileDto = {
  id: string;
  fullName: string | null;
  phone: string | null;
  address: string | null;
  email: string | null;
};

type ApiGetProfileResponse =
  | { ok: true; profile: ProfileDto | null }
  | { ok: false; message: string };

type ApiPostProfileResponse = { ok: true } | { ok: false; message: string };

/* ------------ Helpers ------------ */
async function fetchProfile(): Promise<ProfileDto | null> {
  const res = await fetch("/api/profile", {
    credentials: "include",
    cache: "no-store",
  });
  const json: ApiGetProfileResponse = await res.json();
  return json.ok ? json.profile : null;
}

/* ------------ Component ------------ */
export default function UserAddressClient() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const isFormOpen = searchParams.get("address") === "new";

  // پروفایل فعلی برای نمایش کارت
  const [profile, setProfile] = useState<ProfileDto | null>(null);
  const [loadingProfile, setLoadingProfile] = useState<boolean>(true);

  // state فرم
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [province, setProvince] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [addrLine, setAddrLine] = useState<string>("");
  const [postal, setPostal] = useState<string>("");

  const [saving, setSaving] = useState<boolean>(false);
  const [prefillLoading, setPrefillLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const openForm = () => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("address", "new");
    router.replace(`${pathname}?${sp.toString()}`, { scroll: false });
  };

  const closeForm = () => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.delete("address");
    const url = sp.toString() ? `${pathname}?${sp.toString()}` : pathname;
    router.replace(url, { scroll: false });
  };

  // آدرس نهایی ترکیبی که در ستون address ذخیره می‌کنیم
  const composedAddress = useMemo(() => {
    const parts: string[] = [];
    if (province.trim()) parts.push(`استان ${province.trim()}`);
    if (city.trim()) parts.push(`شهر ${city.trim()}`);
    if (addrLine.trim()) parts.push(addrLine.trim());
    if (postal.trim()) parts.push(`(کدپستی: ${postal.trim()})`);
    return parts.join("، ");
  }, [province, city, addrLine, postal]);

  /* ——— ۱) فچ پروفایل برای نمایش کارت ——— */
  useEffect(() => {
    (async () => {
      setLoadingProfile(true);
      const p = await fetchProfile();
      setProfile(p);
      setLoadingProfile(false);
    })();
  }, []);

  /* ——— ۲) پیش‌پر کردن فرم فقط هنگام باز شدن ——— */
  useEffect(() => {
    if (!isFormOpen) return;

    setPrefillLoading(true);
    (async () => {
      const p = profile ?? (await fetchProfile());
      if (p) {
        setFullName(p.fullName ?? "");
        setEmail(p.email ?? "");
        setPhone(p.phone ?? "");
        // اگر قبلا آدرسی ذخیره بوده، کلش را در addrLine بریز تا از دست نرود
        setAddrLine(p.address ?? "");
      }
      setPrefillLoading(false);
    })();
    // فقط به isFormOpen وابسته نیستیم، چون profile ممکن است بعداً بیاید
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFormOpen]);

  /* ——— ۳) ثبت/ویرایش آدرس ——— */
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (fullName.trim().length < 2) {
      setError("نام و نام خانوادگی معتبر نیست.");
      return;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("ایمیل معتبر نیست.");
      return;
    }
    if (!/^\d{10,11}$/.test(phone.trim())) {
      setError("شماره تماس معتبر نیست.");
      return;
    }
    if (composedAddress.trim().length < 10) {
      setError("آدرس خیلی کوتاه است.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim() || undefined,
          phone: phone.trim(),
          address: composedAddress.trim(),
        }),
      });

      const json: ApiPostProfileResponse = await res.json();
      if (!res.ok || !json.ok) throw new Error("ثبت اطلاعات ناموفق بود");

      // UI را به‌روز کن و فرم را ببند
      setProfile((prev) => ({
        id: prev?.id ?? "",
        fullName: fullName.trim(),
        email: email.trim() || null,
        phone: phone.trim(),
        address: composedAddress.trim(),
      }));
      closeForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در ثبت اطلاعات");
    } finally {
      setSaving(false);
    }
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

      {/* حالت نمایش */}
      {!isFormOpen && (
        <>
          {loadingProfile ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
              در حال بارگذاری…
            </div>
          ) : profile?.address ? (
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
                  onClick={openForm}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm hover:bg-slate-50"
                >
                  <Pencil className="size-4" />
                  ویرایش آدرس
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <MapPin className="size-24 text-slate-300" />
              <p className="mt-6 text-sm md:text-base text-slate-700">
                هنوز هیچ آدرسی ثبت نکرده‌اید.
              </p>
            </div>
          )}
        </>
      )}

      {/* فرم افزودن/ویرایش */}
      {isFormOpen && (
        <div className="mx-auto max-w-2xl">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="size-5 text-accent" />
              <h4 className="font-semibold">افزودن / ویرایش آدرس</h4>
            </div>
            <button
              onClick={closeForm}
              className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-700"
            >
              <X className="size-5" />
              بستن
            </button>
          </div>

          {prefillLoading && (
            <div className="mb-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
              در حال بارگذاری اطلاعات…
            </div>
          )}

          {error && (
            <div className="mb-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-xs text-slate-600">
                  نام و نام خانوادگی
                </span>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-xs text-slate-600">ایمیل</span>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-xs text-slate-600">
                  شماره تماس
                </span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-xs text-slate-600">استان</span>
                <input
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-xs text-slate-600">شهر</span>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </label>

              <label className="block md:col-span-2">
                <span className="mb-1 block text-xs text-slate-600">
                  آدرس دقیق
                </span>
                <textarea
                  rows={3}
                  value={addrLine}
                  onChange={(e) => setAddrLine(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </label>

              <label className="block md:col-span-2 md:max-w-xs">
                <span className="mb-1 block text-xs text-slate-600">
                  کد پستی
                </span>
                <input
                  value={postal}
                  onChange={(e) => setPostal(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </label>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-white hover:opacity-90 disabled:opacity-60"
              >
                <Save className="size-5" />
                {saving ? "در حال ذخیره…" : "ذخیره آدرس"}
              </button>
              <button
                type="button"
                onClick={closeForm}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50"
              >
                انصراف
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
