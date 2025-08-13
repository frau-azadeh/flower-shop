"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UserProfile = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
};

type UserState = {
  profile: UserProfile | null;
  status: "idle" | "loading";
};

const initialState: UserState = {
  profile: null,
  status: "idle",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setStatus: (state, action: PayloadAction<UserState["status"]>) => {
      state.status = action.payload;
    },
    setProfile: (state, action: PayloadAction<UserProfile | null>) => {
      state.profile = action.payload;
    },
    clearProfile: (state) => {
      state.profile = null;
    },
  },
});

export const { setStatus, setProfile, clearProfile } = userSlice.actions;
export default userSlice.reducer;
