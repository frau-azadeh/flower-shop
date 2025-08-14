import z from "zod";

export const adminLoginSchema = z.object({
  firstName: z.string().min(2, "نام کوتاه است"),
  lastName: z
    .string()
    .max(15, "تعداد کاراکترها مجاز نیست")
    .min(2, "نام خانوادگی کوتاه است"),
  password: z.string().min(6, "حداقل 6 کاراکتر مجاز "),
});

export type AdminLoginSchema = z.infer<typeof adminLoginSchema>;
