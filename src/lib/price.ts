type NumLike = number | `${number}` | null | undefined;

function toNumber(v: NumLike): number | null {
  if (v == null) return null;
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  if (typeof v === "string") {
    const n = Number(v.replaceAll(",", "").trim());
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

export function rial(n: number): string {
  return n.toLocaleString("fa-IR");
}

export function computePrice(price: NumLike, sale: NumLike) {
  const base = toNumber(price) ?? 0;
  const s = toNumber(sale);

  // حالت تخفیفِ واقعی
  const hasSale = s != null && s > 0 && base > 0 && s < base;

  // اگر قیمت پایه صفر است ولی sale گذاشتی، فعلی = sale
  const current =
    base <= 0 && s != null && s > 0 ? s :
    hasSale ? s! : base;

  const offPercent =
    hasSale && base > 0 ? Math.round((1 - current / base) * 100) : 0;

  return { base, current, hasSale, offPercent };
}
