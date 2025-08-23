"use client";

import { useRouter } from "next/navigation";

type Props = {
  currentPage: number;
  totalPages: number;
  buildQS: (nextPage: number) => string;
  onPageChange?: (page: number) => void;
};

export default function Pagination({
  currentPage,
  totalPages,
  buildQS,
  onPageChange,
}: Props) {
  const router = useRouter();
  const go = (p: number) => {
    router.push(buildQS(p));
    onPageChange?.(p);
  };

  return (
    <div className="mt-8 flex flex-col items-center justify-between gap-3 text-sm text-slate-600 sm:flex-row">
      <span>
        صفحه {currentPage} از {totalPages}
      </span>
      <div className="flex items-center gap-2">
        <a
          href={buildQS(Math.max(1, currentPage - 1))}
          onClick={(e) => {
            e.preventDefault();
            go(Math.max(1, currentPage - 1));
          }}
          className={`rounded-lg border px-3 py-1.5 ${currentPage <= 1 ? "pointer-events-none opacity-50" : ""}`}
        >
          قبلی
        </a>
        <a
          href={buildQS(Math.min(totalPages, currentPage + 1))}
          onClick={(e) => {
            e.preventDefault();
            go(Math.min(totalPages, currentPage + 1));
          }}
          className={`rounded-lg border px-3 py-1.5 ${currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}`}
        >
          بعدی
        </a>
      </div>
    </div>
  );
}
