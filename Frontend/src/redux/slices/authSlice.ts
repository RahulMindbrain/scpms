import { createSlice } from "@reduxjs/toolkit";
import { loginUser } from "../thunks/loginThunk";

interface AuthState {
  isAuthenticated: boolean;
  userType: string | null;
  user: any;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  userType: null,
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {

    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.userType = null;
    },

  },

  extraReducers: (builder) => {
    builder

      // when login starts
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })

      // when login succeeds
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.userType = action.payload.role;
      })

      // when login fails
      .addCase(loginUser.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;