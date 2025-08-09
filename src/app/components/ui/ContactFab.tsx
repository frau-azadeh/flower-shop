"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Phone, MessageCircle, Instagram, X } from "lucide-react";
import Button from "./Button";

type Props = {
  phone?: string;
  whatsapp?: string;
  instagram?: string;
};

export default function ContactFab({
  phone = "09012764435",
  whatsapp = "989012764435",
  instagram = "frau_azadeh",
}: Props) {
  const [open, setOpen] = useState(false);

  // بستن با ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // لینک واتساپ
  const waHref = useMemo(
    () => `https://wa.me/${whatsapp.replace(/\D/g, "")}`,
    [whatsapp],
  );

  return (
    <>
      {/* بک‌دراپ برای کلیک خارج */}
      {open && (
        <Button
          className="fixed inset-0 z-[85] bg-black/0"
          onClick={() => setOpen(false)}
          aria-label="بستن منو"
        />
      )}

      <div className="fixed bottom-20 right-6 z-[90]">
        {/* پنل */}
        {open && (
          <div
            id="contact-panel"
            className="absolute bottom-20 right-0 w-72 rounded-2xl border border-border bg-surface shadow-xl p-3"
          >
            <div className="text-center text-sm font-semibold bg-muted rounded-lg py-2 mb-2">
              تماس با ما
            </div>

            <ul className="divide-y divide-border">
              <li>
                <a
                  href={`tel:${phone}`}
                  className="flex items-center justify-between px-2 py-3 text-sm hover:text-primary transition-colors"
                >
                  <span>تلفن</span>
                  <Phone className="w-5 h-5" />
                </a>
              </li>
              <li>
                <a
                  href={waHref}
                  target="_blank"
                  className="flex items-center justify-between px-2 py-3 text-sm hover:text-primary transition-colors"
                >
                  <span>واتساپ</span>
                  <MessageCircle className="w-5 h-5" />
                </a>
              </li>
              <li>
                <Link
                  href={`https://instagram.com/${instagram}`}
                  target="_blank"
                  className="flex items-center justify-between px-2 py-3 text-sm hover:text-primary transition-colors"
                >
                  <span>اینستاگرام</span>
                  <Instagram className="w-5 h-5" />
                </Link>
              </li>
            </ul>

            {/* نوک حباب */}
            <div className="absolute -bottom-2 left-6 w-4 h-4 bg-surface rotate-45 border-b border-r border-border" />
          </div>
        )}

        {/* دکمهٔ شناور */}
        <Button
          type="button"
          size="icon"
          aria-expanded={open}
          aria-controls="contact-panel"
          onClick={() => setOpen((v) => !v)}
          className={`w-12 h-12 rounded-full shadow-lg text-white flex items-center justify-center transition-colors bottom-20 ${
            open
              ? "bg-accent hover:bg-accent-hover"
              : "bg-primary hover:bg-primary-hover"
          }`}
        >
          {open ? (
            <X className="w-4 h-4" />
          ) : (
            <MessageCircle className="w-4 h-4" />
          )}
        </Button>
      </div>
    </>
  );
}
