import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AdminRole = "BLOG" | "PRODUCTS" | "FULL";

export interface AdminState {
  id: string | null;
  firstName: string | null;
  lastName: string | null;
  role: AdminRole | null;
  isAuthenticated: boolean;
}

const initialState: AdminState = {
  id: null,
  firstName: null,
  lastName: null,
  role: null,
  isAuthenticated: false,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdmin(
      _state,
      action: PayloadAction<{
        id: string;
        firstName: string;
        lastName: string;
        role: AdminRole;
      }>,
    ) {
      const { id, firstName, lastName, role } = action.payload;
      return { id, firstName, lastName, role, isAuthenticated: true };
    },
    logoutAdmin() {
      return initialState;
    },
  },
});

export const { setAdmin, logoutAdmin } = adminSlice.actions;
export default adminSlice.reducer;
