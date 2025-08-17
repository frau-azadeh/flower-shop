// utils/paginationUtils.ts

export type PageItem = number | "...";

export function getPaginationRange(current: number, total: number): PageItem[] {
  const delta = 2; // چند صفحه اطراف current نشون داده بشه
  const range: PageItem[] = [];

  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const left = Math.max(current - delta, 2);
  const right = Math.min(current + delta, total - 1);

  range.push(1);
  if (left > 2) range.push("...");

  for (let i = left; i <= right; i++) {
    range.push(i);
  }

  if (right < total - 1) range.push("...");
  range.push(total);

  return range;
}
