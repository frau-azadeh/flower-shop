"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function useAddressUrl() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const isFormOpen = searchParams.get("address") === "new";

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

  return { isFormOpen, openForm, closeForm };
}
