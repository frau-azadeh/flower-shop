"use client";

import {
  Share2,
  Send,
  Twitter,
  Linkedin,
  Link as LinkIcon,
  MessageCircle,
} from "lucide-react";
import { useCallback, useMemo } from "react";

type Props = { slug: string; title: string };

function encode(v: string): string {
  return encodeURIComponent(v);
}

export default function ShareBox({ slug, title }: Props) {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const url = useMemo(() => `${base}/blog/${slug}`, [base, slug]);

  const copy = useCallback(() => {
    void navigator.clipboard.writeText(url);
  }, [url]);

  return (
    <div className="mt-4 rounded-xl bg-white p-4 shadow ring-1 ring-black/5">
      <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
        <Share2 size={16} /> اشتراک‌گذاری
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <a
          href={`https://t.me/share/url?url=${encode(url)}&text=${encode(title)}`}
          target="_blank"
          className="flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50"
        >
          <Send size={16} /> تلگرام
        </a>

        <a
          href={`https://twitter.com/intent/tweet?url=${encode(url)}&text=${encode(title)}`}
          target="_blank"
          className="flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50"
        >
          <Twitter size={16} /> X
        </a>

        <a
          href={`https://www.linkedin.com/shareArticle?mini=true&url=${encode(url)}&title=${encode(title)}`}
          target="_blank"
          className="flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50"
        >
          <Linkedin size={16} /> لینکدین
        </a>

        <a
          href={`https://api.whatsapp.com/send?text=${encode(`${title} ${url}`)}`}
          target="_blank"
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