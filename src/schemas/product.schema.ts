import { z } from "zod";

/** create */
export const createProductSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  price: z.coerce.number().int().nonnegative(),
  salePrice: z
    .union([z.coerce.number().int().nonnegative(), z.literal(""), z.null()])
    .optional()
    .transform((v) => (v === "" ? null : (v as number | null))),
  category: z.string().min(1),
  stock: z.coerce.number().int().nonnegative(),
  active: z.union([z.literal("true"), z.literal("false")]).transform((v) => v === "true"),
  description: z.string().optional().default(""),
});
export type CreateProductInput = z.infer<typeof createProductSchema>;
export function parseCreateProduct(form: FormData): CreateProductInput {
  return createProductSchema.parse({
    name: form.get("name"),
    slug: form.get("slug"),
    price: form.get("price"),
    salePrice: form.get("salePrice"),
    category: form.get("category"),
    stock: form.get("stock"),
    active: form.get("active"),
    description: form.get("description") ?? "",
  });
}

/** update */
export const updateProductSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1).optional(),      // برای پیدا کردن
  name: z.string().optional(),
  newSlug: z.string().min(1).optional(),   // اگر بخواهیم اسلاگ را عوض کنیم
  price: z.union([z.coerce.number().int().nonnegative(), z.undefined()]),
  salePrice: z
    .union([z.coerce.number().int().nonnegative(), z.literal(""), z.null(), z.undefined()])
    .transform((v) => (v === "" ? null : (v as number | null | undefined))),
  category: z.string().optional(),
  stock: z.union([z.coerce.number().int().nonnegative(), z.undefined()]),
  active: z
    .union([z.literal("true"), z.literal("false")])
    .optional()
    .transform((v) => (v == null ? undefined : v === "true")),
  description: z.string().optional(),
});
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export function parseUpdateProduct(form: FormData): UpdateProductInput {
  return updateProductSchema.parse({
    id: form.get("id") ?? undefined,
    slug: form.get("slug") ?? undefined,
    name: form.get("name") ?? undefined,
    newSlug: form.get("newSlug") ?? undefined,
    price: form.get("price") ?? undefined,
    salePrice: form.get("salePrice") ?? undefined,
    category: form.get("category") ?? undefined,
    stock: form.get("stock") ?? undefined,
    active: form.get("active") ?? undefined,
    description: form.get("description") ?? undefined,
  });
}

/** publish/unpublish */
export const publishProductSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1).optional(),
  active: z.boolean(),
});
export type PublishProductInput = z.infer<typeof publishProductSchema>;

/** delete */
export const deleteProductSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1).optional(),
});
export type DeleteProductInput = z.infer<typeof deleteProductSchema>;