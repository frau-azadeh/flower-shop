"use client";

import type { ReactNode } from "react";

export function AccessSwitch({
  checked,
  onChange,
  label,
  iconLeft,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  iconLeft?: ReactNode;
}) {
  return (
    <label className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
      <span className="flex items-center gap-2">
        {iconLeft}
        <span className="text-sm text-slate-800">{label}</span>
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${checked ? "bg-accent" : "bg-slate-300"}`}
      >
        <span
          className={`h-5 w-5 rounded-full bg-white shadow transition ${checked ? "translate-x-5" : "translate-x-1"}`}
        />
      </button>
    </label>
  );
}
