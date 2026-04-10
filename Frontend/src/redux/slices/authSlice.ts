import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  userType: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {

    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.userType = action.payload.role; // take role from backend
    },

    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.userType = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;