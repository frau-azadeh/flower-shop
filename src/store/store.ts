"use client";
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import adminReducer from "./admin/adminSlice";
import cartReducer from "./orders/cartSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    admin: adminReducer,
     cart: cartReducer ,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
