"use client";

import { useEffect, useState } from "react";
import { X, ShieldCheck, FileText, Package, ShoppingBag } from "lucide-react";
import type { AdminUser } from "@/types/admin";
import { createUser, updateUser } from "@/app/admin/users/actions";
import { canBlog, canProducts, roleFromToggles } from "./utils/roles";
import { AccessSwitch } from "./AccessSwitch";

export function NewUserModal({
  onClose,
  initial,
  onSaved,
}: {
  onClose: () => void;
  initial: AdminUser | null;
  onSaved: (u: AdminUser) => void;
}) {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>(""); // فقط UI
  const [blog, setBlog] = useState<boolean>(true);
  const [commerce, setCommerce] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");

  const isEdit = !!initial;

  useEffect(() => {
    if (initial) {
      setName(`${initial.firstName} ${initial.lastName}`);
      setBlog(canBlog(initial.role));
      setCommerce(canProducts(initial.role));
      setPassword("");
    } else {
      setName("");
      setEmail("");
      setBlog(true);
      setCommerce(false);
      setPassword("");
    }
  }, [initial]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmed = name.trim();
    if (!trimmed.includes(" ")) {
      alert("نام و نام خانوادگی را با فاصله وارد کنید.");
      return;
    }

    const [firstName, ...rest] = trimmed.split(" ");
    const lastName = rest.join(" ");
    const role = roleFromToggles(blog, commerce);

    if (isEdit && initial) {
      const saved = await updateUser(initial.id, {
        firstName,
        lastName,
        role,
        isActive: true,
        password: password ? password : undefined,
      });
      if (saved) onSaved(saved);
    } else {
      if (!password) {
        alert("رمز عبور الزامی است");
        return;
      }
      const saved = await createUser({
        firstName,
        lastName,
        password,
        role,
        isActive: true,
      });
      if (saved) onSaved(saved);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/40 p-3">
      <div className="w-full md:max-w-xl rounded-2xl bg-white shadow-xl p-4 md:p-6">
        {/* Title */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-700">
            <ShieldCheck className="size-5 text-accent" />
            <h3 className="font-semibold">
              {isEdit ? "ویرایش کاربر" : "افزودن کاربر"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-slate-100"
            aria-label="بستن"
            type="button"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="mb-1 block text-xs text-slate-600">
                نام و نام خانوادگی
              </span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثلاً: علی رضایی"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs text-slate-600">ایمیل</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </label>
          </div>

          {/* Permissions */}
          <div>
            <p className="mb-2 text-sm font-medium text-slate-700">دسترسی‌ها</p>
            <div className="space-y-2">
              <AccessSwitch
                checked={blog}
                onChange={setBlog}
                label="وبلاگ"
                iconLeft={<FileText className="size-4 text-slate-600" />}
              />
              <AccessSwitch
                checked={commerce}
                onChange={setCommerce}
                label="محصول + سفارش"
                iconLeft={
                  <span className="inline-flex items-center gap-1 text-slate-600">
                    <Package className="size-4" />
                    <ShoppingBag className="size-4" />
                  </span>
                }
              />
            </div>
          </div>

          {/* Password */}
          <label className="block">
            <span className="mb-1 block text-xs text-slate-600">
              {isEdit ? "تغییر رمز (اختیاری)" : "رمز عبور"}
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              required={!isEdit}
            />
          </label>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="rounded-xl bg-accent px-4 py-2 text-sm text-white hover:opacity-90"
            >
              {isEdit ? "ذخیره تغییرات" : "ذخیره کاربر"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
