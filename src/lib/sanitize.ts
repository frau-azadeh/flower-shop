// src/lib/sanitize.ts
import sanitizeHtml from "sanitize-html";

/**
 * تنظیماتی که با TipTap جور درمیاد:
 * - تگ‌های متنی، لیست‌ها، نقل‌قول، کد، جدول، تصویر، لینک…
 * - حذف onerror/onclick و URLهای javascript:
 * - اجازه به target/_blank و rel های امن برای لینک‌ها
 */
export function sanitizeContent(dirtyHtml: string): string {
  const clean = sanitizeHtml(dirtyHtml, {
    // تگ‌های مجاز
    allowedTags: [
      "p",
      "br",
      "span",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "strong",
      "b",
      "em",
      "i",
      "u",
      "s",
      "mark",
      "blockquote",
      "code",
      "pre",
      "ul",
      "ol",
      "li",
      "a",
      "img",
      "hr",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
      "figure",
      "figcaption",
    ],
    // صفت‌های مجاز برای هر تگ
    allowedAttributes: {
      a: ["href", "name", "target", "rel"],
      img: [
        "src",
        "alt",
        "title",
        "width",
        "height",
        "srcset",
        "sizes",
        "loading",
        "decoding",
      ],
      "*": ["id"], // اگر لازم داری data-attribute یا class نگه داری، اینجا اضافه کن
    },
    // اگر می‌خواهی class ها هم بمانند:
    // allowedClasses: { "*": ["*"] },

    // فقط این پروتکل‌ها امن هستند
    allowedSchemes: ["http", "https", "data"], // data برای تصاویر base64 اختیاری است
    allowedSchemesAppliedToAttributes: ["href", "src"],

    // لینک‌های target=_blank را مجبور کن rel امن داشته باشند
    transformTags: {
      a: (tagName, attribs) => {
        const attrs = { ...attribs };
        if (attrs.target === "_blank") {
          attrs.rel = attrs.rel
            ? `${attrs.rel} noopener noreferrer`
            : "noopener noreferrer";
        }
        return { tagName, attribs: attrs };
      },
    },

    // هر چیزی خارج از allowedTags و allowedAttributes حذف می‌شود
    // اسکریپت‌ها و event handlerها (مثل onerror) خودکار حذف می‌شن
    // textFilter: (text) => text  // اگر خواستی متن خام را هم دستکاری کنی
  });

  return clean;
}

/** نسخهٔ امن برای لیست‌ها: sanitize + حذف تگ‌ها برای خلاصه */
export function toExcerpt(html: string, max = 160): string {
  const safe = sanitizeContent(html);
  const plain = safe
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return plain.length > max ? plain.slice(0, max) + "…" : plain;
}
