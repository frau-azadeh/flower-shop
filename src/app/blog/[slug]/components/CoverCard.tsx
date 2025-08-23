import Image from "next/image";

type Props = {
  title: string;
  coverUrl: string | null;
};

export default function CoverCard({ title, coverUrl }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/5 bg-white">
      <div className="relative aspect-[16/9] md:aspect-[20/15] bg-gradient-to-b from-gray-50 to-gray-100">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 hover:scale-[1.02]"
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            بدون کاور
          </div>
        )}
      </div>
    </div>
  );
}
