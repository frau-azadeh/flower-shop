"use client";

import { Save, Upload } from "lucide-react";

type Props = {
  submitting: boolean;
  editing: boolean;
};

export default function ProductActionsCard({ submitting, editing }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex flex-col gap-2">
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
          title="ذخیره پیش‌نویس (UI)"
        >
          <Save className="size-4" />
          ذخیره پیش‌نویس
        </button>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-3 py-2 text-sm text-white hover:opacity-90 disabled:opacity-70"
          title={editing ? "ثبت ویرایش" : "انتشار (UI)"}
        >
          <Upload className="size-4" />
          {submitting ? "در حال ارسال..." : editing ? "ثبت ویرایش" : "انتشار محصول"}
        </button>
      </div>
    </div>
  );
}
