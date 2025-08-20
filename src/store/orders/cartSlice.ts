import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/** آیتم سبد */
export type CartItem = {
  productId: string;
  name: string;
  qty: number;
  price?: number;
  coverUrl?: string;
  slug?: string;
};

/** استیت سبد */
type CartState = {
  items: Record<string, CartItem>;
  ownerId: string | null; // null = مهمان
};

/** کلید ذخیره‌سازی */
const key = (uid: string | null) => `cart_v1:${uid ?? "anon"}`;

/** خواندن امن از localStorage (همیشه همان شکل { items: {...} }) */
function read(uid: string | null): Record<string, CartItem> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(key(uid));
    if (!raw) return {};
    const obj = JSON.parse(raw) as { items: Record<string, CartItem> };
    if (obj && obj.items && typeof obj.items === "object") return obj.items;
    return {};
  } catch {
    return {};
  }
}

/** نوشتن امن به localStorage */
function write(uid: string | null, items: Record<string, CartItem>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key(uid), JSON.stringify({ items }));
  } catch {}
}

const initialState: CartState = { items: {}, ownerId: null };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    /** وقتی کاربر عوض می‌شود (ورود/خروج/سوییچ)، مالک را ست کن و سبد همان کاربر را لود کن */
    setOwner(state, action: PayloadAction<string | null>) {
      const uid = action.payload ?? null;
      state.ownerId = uid;
      state.items = read(uid);
    },

    addItem(
      state,
      action: PayloadAction<{
        productId: string;
        name: string;
        qty: number;
        price?: number;
        coverUrl?: string;
        slug?: string;
      }>
    ) {
      const { productId, name, qty, price, coverUrl, slug } = action.payload;
      const ex = state.items[productId];
      const nextQty = (ex?.qty ?? 0) + qty;
      state.items[productId] = {
        productId,
        name,
        qty: nextQty,
        price: price ?? ex?.price,
        coverUrl: coverUrl ?? ex?.coverUrl,
        slug: slug ?? ex?.slug,
      };
      write(state.ownerId, state.items);
    },

    setQty(state, action: PayloadAction<{ productId: string; qty: number }>) {
      const { productId, qty } = action.payload;
      const it = state.items[productId];
      if (!it) return;
      it.qty = Math.max(1, qty);
      write(state.ownerId, state.items);
    },

    removeItem(state, action: PayloadAction<{ productId: string }>) {
      delete state.items[action.payload.productId];
      write(state.ownerId, state.items);
    },

    clearCart(state) {
      state.items = {};
      write(state.ownerId, state.items);
    },
  },
});

export const { setOwner, addItem, setQty, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
