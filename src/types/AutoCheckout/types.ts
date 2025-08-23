import type { CartItem as StoreCartItem } from "@/store/orders/cartSlice";

export type CheckoutItem = Pick<StoreCartItem, "productId" | "qty">;

export type Profile = {
  id: string;
  fullName: string | null;
  phone: string | null;
  address: string | null;
  email: string | null;
};

export type ProfileRes =
  | { ok: true; profile: Profile | null }
  | { ok: false; message: string };

export type SubmitOrderRes =
  | { ok: true; orderId: string }
  | { ok: false; message?: string };
