"use client";

import { useEffect, useState } from "react";
import type { AdminUser, AdminRole } from "@/types/admin";

type SubmitCreate = {
  firstName: string;
  lastName: string;
  password: string;
  role: AdminRole;
  isActive: boolean;
};

type SubmitUpdate = {
  firstName: string;
  lastName: string;
  role: AdminRole;
  isActive: boolean;
  password?: string;
};

export default function UserModal({
  initial,
  onClose,
  onSubmit,
}: {
  initial: AdminUser | null;
  onClose: () => void;
  onSubmit: (values: SubmitCreate | SubmitUpdate) => Promise<void>;
}) {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName]   = useState<string>("");
  const [role, setRole]           = useState<AdminRole>("FULL");
  const [isActive, setIsActive]   = useState<boolean>(true);
  const [password, setPassword]   = useState<string>("");

  useEffect(() => {
    if (initial) {
      setFirstName(initial.firstName);
      setLastName(initial.lastName);
      setRole(initial.role);
      setIsActive(initial.isActive);
      setPassword("");
    }
  }, [initial]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (initial) {
      await onSubmit({ firstName, lastName, role, isActive, password: password || undefined });
    } else {
      await onSubmit({ firstName, lastName, role, isActive, password });
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3">
      <div className="w-full max-w-lg rounded-xl bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold">{initial ? "ویرایش کاربر" : "افزودن کاربر"}</h3>
          <button onClick={onClose} className="rounded px-2 py-1 border">x</button>
        </div>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              placeholder="نام"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="rounded border px-3 py-2 text-sm"
              required
            />
            <input
              placeholder="نام خانوادگی"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="rounded border px-3 py-2 text-sm"
              required
            />
          </div>

          <input
            type="password"
            placeholder={initial ? "تغییر رمز (اختیاری)" : "رمز عبور"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded border px-3 py-2 text-sm"
            required={!initial}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as AdminRole)}
              className="rounded border px-3 py-2 text-sm"
            >
              <option value="FULL">ادمین کامل</option>
              <option value="BLOG">ادمین وبلاگ</option>
              <option value="PRODUCTS">ادمین محصولات</option>
            </select>

            <label className="flex items-center gap-2">
              <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
              <span className="text-sm">فعال</span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded border px-3 py-2 text-sm">انصراف</button>
            <button type="submit" className="rounded bg-blue-600 px-3 py-2 text-sm text-white">
              ذخیره
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
