"use client";

import { CheckCircle2 } from "lucide-react";

type Props = {
  active: boolean;
  onToggle: () => void;
  editing: boolean;
  onCancelEdit: () => void;
};

export default function ProductStatusCard({ active, onToggle, editing, onCancelEdit }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <h4 className="mb-3 text-sm font-semibold text-slate-700">وضعیت</h4>

      <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 px-3 py-2">
        <span className="text-sm text-slate-700">فعال باشد</span>
        <span
          onClick={onToggle}
          className={`inline-flex items-center gap-2 text-sm ${
            active ? "text-emerald-600" : "text-slate-400"
          }`}
          role="switch"
          aria-checked={active}
        >
          <CheckCircle2 className="size-5" />
        </span>
      </label>

      {editing && (
        <button
          type="button"
          onClick={onCancelEdit}
          className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
          title="لغو ویرایش"
        >
          لغو ویرایش
        </button>
      )}
    </div>
  );
}
