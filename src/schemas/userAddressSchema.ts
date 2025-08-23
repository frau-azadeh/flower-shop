import { z } from "zod";

/** فیلدهای فرم آدرس + قوانین اعتبارسنجی */
const BaseSchema = z.object({
  fullName: z.string().trim().min(2, "نام و نام خانوادگی معتبر نیست."),
  email: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine((v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), "ایمیل معتبر نیست."),
  phone: z.string().trim().regex(/^\d{10,11}$/, "شماره تماس معتبر نیست."),
  province: z.string().trim().optional(),
  city: z.string().trim().optional(),
  addrLine: z.string().trim().min(1, "آدرس را وارد کنید."),
  postal: z.string().trim().optional(),
});

export type AddressFormValues = z.infer<typeof BaseSchema>;

/** تبدیل فیلدهای فرم به آدرس نهایی ذخیره‌شونده */
export function composeAddress(v: Pick<AddressFormValues, "province" | "city" | "addrLine" | "postal">): string {
  const parts: string[] = [];
  if (v.province?.trim()) parts.push(`استان ${v.province.trim()}`);
  if (v.city?.trim()) parts.push(`شهر ${v.city.trim()}`);
  if (v.addrLine?.trim()) parts.push(v.addrLine.trim());
  if (v.postal?.trim()) parts.push(`(کدپستی: ${v.postal.trim()})`);
  return parts.join("، ");
}

/** اسکیما با قانون طول آدرس ترکیبی */
export const AddressSchema = BaseSchema.superRefine((values, ctx) => {
  const composed = composeAddress(values);
  if (composed.trim().length < 10) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["addrLine"],
      message: "آدرس خیلی کوتاه است.",
    });
  }
});
