"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Pagination from "@/app/components/ui/Pagination";

type Row = {
  title: string;
  slug: string;
  content: string;
  publishedAt: string | null;
  coverUrl: string | null; // ← اضافه شد
};

const POSTS_PER_PAGE = 9;

export default function BlogIndexClient({
  posts,
  page,
}: {
  posts: Row[];
  page: number;
}) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(page);

  useEffect(() => {
    setCurrentPage(page);
  }, [page]);

  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const currentPosts = posts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  const handlePageChange = (p: number) => {
    router.push(`?page=${p}`);
    setCurrentPage(p);
  };

  return (
    <main dir="rtl" className="bg-background py-10 px-4 mt-12">
      <h1 className="text-2xl font-bold mb-6">بلاگ</h1>

      <div className="max-w-7xl mx-auto">
        <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {currentPosts.map((p) => (
            <li
              key={p.slug}
              className="rounded-xl bg-white shadow-sm border overflow-hidden hover:shadow-md transition"
            >
              {/* کاور – فقط اگر آدرس معتبر داریم */}
              {p.coverUrl ? (
                <div className="relative w-full h-48">
                  <Image
                    src={p.coverUrl}
                    alt={p.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    priority={false}
                  />
                </div>
              ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                  بدون کاور
                </div>
              )}

              <div className="p-4">
                <Link
                  href={`/blog/${p.slug}`}
                  className="font-bold text-primary hover:text-primary/80"
                >
                  {p.title}
                </Link>

                <span className="block text-xs text-gray-400 mt-1">
                  {p.publishedAt
                    ? new Date(p.publishedAt).toLocaleDateString("fa-IR")
                    : ""}
                </span>

                <p className="mt-3 text-gray-600 leading-7 line-clamp-3 text-justify">
                  {p.content}
                </p>

                <Link
                  href={`/blog/${p.slug}`}
                  className="mt-4 inline-block text-blue-600 hover:text-blue-800"
                >
                  بیشتر →
                </Link>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </main>
  );
}
