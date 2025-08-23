import Link from "next/link";
import Image from "next/image";
import { PostRow } from "@/types/blog";
import { fmtDateFa, readingTime, stripHtml } from "@/lib/blog/utils";

type Props = { post: PostRow };

export default function FeatureCard({ post }: Props) {
  const minutes = readingTime(stripHtml(post.content));
  const excerpt = (() => {
    const plain = stripHtml(post.content);
    return plain.length > 240 ? plain.slice(0, 240) + "…" : plain;
  })();

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group relative mb-6 block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-lg lg:hidden"
    >
      <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr]">
        <div className="relative aspect-[16/10] md:aspect-auto">
          {post.coverUrl ? (
            <Image
              src={post.coverUrl}
              alt={post.title}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-100 text-xs text-slate-400">
              بدون کاور
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
        <div className="p-5">
          <div className="mb-1 text-xs text-slate-500">
            {fmtDateFa(post.publishedAt)} · {minutes} دقیقه مطالعه
          </div>
          <h2 className="line-clamp-2 text-lg font-extrabold text-slate-900">
            {post.title}
          </h2>
          <p className="mt-2 line-clamp-3 text-justify text-sm leading-7 text-slate-600">
            {excerpt}
          </p>
          <span className="mt-4 inline-block text-[13px] font-medium text-primary">
            مطالعه ↗
          </span>
        </div>
      </div>
    </Link>
  );
}
