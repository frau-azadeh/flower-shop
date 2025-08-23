// app/components/ui/confirmToast.tsx
"use client";

import { toast } from "react-hot-toast";

type ConfirmOptions = {
  message: string;
  confirmText?: string;
  cancelText?: string;
};

export function confirmToast({
  message,
  confirmText = "بله، انجام بده",
  cancelText = "انصراف",
}: ConfirmOptions): Promise<boolean> {
  return new Promise((resolve) => {
    const id = toast.custom(
      (t) => (
        <div
          dir="rtl"
          className={`rounded-xl border border-slate-200 bg-white px-4 py-3 shadow ring-1 ring-black/5 ${
            t.visible ? "animate-in fade-in-0 zoom-in-95" : "animate-out fade-out-0 zoom-out-95"
          }`}
        >
          <p className="text-sm text-slate-800">{message}</p>

          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => {
                toast.dismiss(id);
                resolve(true);
              }}
              className="rounded-lg bg-primary px-3 py-1.5 text-sm text-white hover:opacity-90"
            >
              {confirmText}
            </button>
            <button
              onClick={() => {
                toast.dismiss(id);
                resolve(false);
              }}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm hover:bg-slate-50"
            >
              {cancelText}
            </button>
          </div>
        </div>
      ),
      { duration: 60000 } // زمان کافی برای کلیک
    );
  });
}
