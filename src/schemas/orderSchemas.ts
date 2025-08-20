import { z } from "zod";

export const makeOrderItemSchema = z.object({
  productId: z.string().uuid(),
  qty: z.number().int().min(1),
});

export const makeOrderSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(5), // اگر خواستی: z.string().regex(/^09\d{9}$/)
  address: z.string().min(5),
  note: z.string().max(500).nullable().optional(),
  items: z
    .array(
      z.object({
        productId: z.string().uuid(), // ⬅️ باید حتماً UUID واقعی باشد
        qty: z.number().int().min(1).max(999),
      }),
    )
    .min(1),
});

export type MakeOrderInput = z.infer<typeof makeOrderSchema>;

export const makeOrderResponseSchema = z.object({
  ok: z.literal(true),
  orderId: z.string().uuid(),
});

export type MakeOrderResponse = z.infer<typeof makeOrderResponseSchema>;
