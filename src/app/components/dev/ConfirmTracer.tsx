// app/components/dev/ConfirmTracer.tsx
"use client";
import { useEffect } from "react";

export default function ConfirmTracer() {
  useEffect(() => {
    const oldConfirm = window.confirm.bind(window);
    window.confirm = function (msg?: string) {
      console.trace("window.confirm called with:", msg);
      return oldConfirm(msg);
    };
    return () => { window.confirm = oldConfirm; };
  }, []);
  return null;
}
