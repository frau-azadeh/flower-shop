"use client";

import { useCallback, useMemo } from "react";
import {
  Share2,
  Send,
  Twitter,
  Linkedin,
  Link as LinkIcon,
  MessageCircle,
} from "lucide-react";

type Props = {
  title: string;
  /** لینک کامل برای اشتراک‌گذاری (ترجیحاً ست بشود) */
  url?: string;
  /** اگر url ندهی، از این‌ها برای ساخت لینک استفاده می‌شود */
  path?: "blog" | "products";
  slug?: string;
};

export default function ShareBox({
  title,
  url,
  path = "blog",
  slug = "",
}: Props) {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const finalUrl = useMemo(
    () => url ?? `${base}/${path}/${slug}`,
    [url, base, path, slug],
  );

  const copy = useCallback(() => {
    void navigator.clipboard.writeText(finalUrl);
  }, [finalUrl]);

  const enc = (s: string) => encodeURIComponent(s);

  return (
    <div className="mt-4 rounded-xl bg-white p-4 shadow ring-1 ring-black/5">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <Share2 size={16} /> اشتراک‌گذاری
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <a
          href={`https://t.me/share/url?url=${enc(finalUrl)}&text=${enc(title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50"
        >
          <Send size={16} /> تلگرام
        </a>
        <a
          href={`https://twitter.com/intent/tweet?url=${enc(finalUrl)}&text=${enc(title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50"
        >
          <Twitter size={16} /> X
        </a>
        <a
          href={`https://www.linkedin.com/shareArticle?mini=true&url=${enc(finalUrl)}&title=${enc(title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50"
        >
          <Linkedin size={16} /> لینکدین
        </a>
        <a
          href={`https://api.whatsapp.com/send?text=${enc(`${title} ${finalUrl}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50"
        >
          <MessageCircle size={16} /> واتس‌اپ
        </a>
        <button
          onClick={copy}
          className="flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50"
        >
          <LinkIcon size={16} /> کپی لینک
        </button>
      </div>
    </div>
  );
}