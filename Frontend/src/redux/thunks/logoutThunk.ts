import { createAsyncThunk } from "@reduxjs/toolkit";
import { postAPI } from "../../apis/api";
import { logout } from "../slices/authSlice";

/**
 * Logout thunk — calls backend to clear cookies and then clears local state.
 */
export const logoutUser = createAsyncThunk(
    "auth/logoutUser",
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const response = await postAPI<any>("/auth/logout", {});
            
            // Clear local state regardless of whether the API call succeeded 
            // (the user wants to be logged out anyway)
            dispatch(logout());
            
            return response;
        } catch (error: any) {
            // Even if API fails (e.g. token already expired), we still want to clear local state
            dispatch(logout());
            return rejectWithValue(error?.message || "Logout failed");
        }
    }
);
