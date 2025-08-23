export const POSTS_PER_PAGE = 9;

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function readingTime(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function fmtDateFa(d: string | null): string {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString("fa-IR");
  } catch {
    return "";
  }
}
