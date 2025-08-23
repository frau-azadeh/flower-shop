import Link from "next/link";
import Image from "next/image";
import { PostRow } from "@/types/blog";
import { fmtDateFa, readingTime, stripHtml } from "@/lib/blog/utils";

type Props = { post: PostRow };

export default function PostCard({ post }: Props) {
  const plain = stripHtml(post.content);
  const excerpt = plain.length > 200 ? plain.slice(0, 200) + "…" : plain;

  return (
    <li className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[16/10] overflow-hidden">
        {post.coverUrl ? (
          <Image
            src={post.coverUrl}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-100 text-xs text-slate-400">
            بدون کاور
          </div>
        )}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <span className="rounded-full bg-white/90 px-2 py-1 text-[11px] text-slate-700 shadow-sm backdrop-blur">
            {fmtDateFa(post.publishedAt)}
          </span>
          <span className="rounded-full bg-white/90 px-2 py-1 text-[11px] text-slate-700 shadow-sm backdrop-blur">
            {readingTime(plain)} دقیقه
          </span>
        </div>
      </div>

      <div className="p-4">
        <Link
          href={`/blog/${post.slug}`}
          className="line-clamp-2 text-[15px] font-bold text-slate-900 transition-colors hover:text-primary"
        >
          {post.title}
        </Link>
        <p className="mt-2 line-clamp-3 text-justify text-sm leading-7 text-slate-600">
          {excerpt}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-1 text-[13px] font-medium text-primary transition-all hover:gap-1.5"
          >
            مطالعه <span aria-hidden>↗</span>
          </Link>
          <span className="text-[10px] text-slate-400">● ● ●</span>
        </div>
      </div>
    </li>
  );
}
