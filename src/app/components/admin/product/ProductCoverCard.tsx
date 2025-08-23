"use client";
import React from "react";
import { ImagePlus } from "lucide-react";

type Props = {
  coverPreview: string;
  // هم RefObject و هم MutableRefObject را قبول کند و nullable هم باشد
  inputRef:
    | React.RefObject<HTMLInputElement>
    | React.MutableRefObject<HTMLInputElement | null>;
  onPick: (file: File | null) => void;
};

export default function ProductCoverCard({
  coverPreview,
  inputRef,
  onPick,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <h4 className="mb-3 text-sm font-semibold text-slate-700">تصویر کاور</h4>

      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
        >
          <ImagePlus className="size-4" />
          انتخاب تصویر
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onPick(e.target.files?.[0] ?? null)}
        />
      </div>

      <div className="mt-3">
        {coverPreview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverPreview}
            alt=""
            className="aspect-video w-full rounded-xl border border-slate-200 object-cover"
          />
        ) : (
          <div className="aspect-video w-full rounded-xl border border-dashed border-slate-200 bg-slate-50" />
        )}
      </div>
    </div>
  );
}
