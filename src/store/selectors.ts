// store/selectors.ts
import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import type { CartItem } from "@/store/orders/cartSlice";

export const selectCartItemsMap = (s: RootState) => s.cart.items;

export const selectCartItemsArray = createSelector(
  [selectCartItemsMap],
  (map): CartItem[] => Object.values(map),
);

export const selectCartTotalQty = createSelector(
  [selectCartItemsArray],
  (arr) => arr.reduce((sum, it) => sum + it.qty, 0),
);
