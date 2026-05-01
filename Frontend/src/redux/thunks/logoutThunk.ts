import { createAsyncThunk } from "@reduxjs/toolkit";
import { postAPI } from "../../apis/api";
import { logout } from "../slices/authSlice";

/**
 * Logout thunk — calls backend to clear cookies and then clears local state.
 */
export const logoutUser = createAsyncThunk(
    "auth/logoutUser",
    async (_, { dispatch, rejectWithValue }) => {
        // 1. Immediately clear local auth state to provide instant feedback and prevent flickering
        dispatch(logout());
        
        try {
            const response = await postAPI<any>("/auth/logout", {});
            return response;
        } catch (error: any) {
            // Even if API fails (e.g. token already expired), state is already cleared
            return rejectWithValue(error?.message || "Logout failed");
        }
    }
);
