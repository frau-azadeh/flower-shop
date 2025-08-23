import Image from "next/image";
import Link from "next/link";
import type { MiniPost } from "@/types/blog";

type Props = {
  posts: MiniPost[];
  className?: string;
  title?: string;
};

export default function RecentPosts({
  posts,
  className = "",
  title = "آخرین مطالب",
}: Props) {
  if (!posts?.length) return null;

  return (
    <div className={className}>
      <div className="mb-3 text-sm font-semibold text-gray-700">{title}</div>

      <ul className="space-y-3">
        {posts.map((p) => (
          <li
            key={p.slug}
            className="overflow-hidden rounded-xl border bg-white shadow-sm hover:shadow transition"
          >
            <Link href={`/blog/${p.slug}`} className="flex gap-3">
              <div className="relative h-20 w-28 shrink-0 bg-gray-100">
                {p.coverUrl ? (
                  <Image
                    src={p.coverUrl}
                    alt={p.title}
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-400">
                    بدون کاور
                  </div>
                )}
              </div>

              <div className="flex min-w-0 flex-1 items-center pr-2">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-gray-900">
                    {p.title}
                  </div>
                  {p.publishedAt && (
                    <div className="mt-0.5 text-xs text-gray-500">
                      {new Date(p.publishedAt).toLocaleDateString("fa-IR")}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
