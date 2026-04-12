import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAPI, putAPI } from "../../apis/api";

export const fetchCompanies = createAsyncThunk(
    "company/fetchCompanies",
    async (params: any, { rejectWithValue }) => {
        try {
            const response = await getAPI<any>("/admin/get-companies", params);
            return response;
        } catch (error: any) {
            return rejectWithValue(error?.message || "Failed to fetch companies");
        }
    }
);

export const fetchInactiveCompanies = createAsyncThunk(
    "company/fetchInactiveCompanies",
    async (params: any, { rejectWithValue }) => {
        try {
            const response = await getAPI<any>("/admin/get-inactive-companies", params);
            return response;
        } catch (error: any) {
            return rejectWithValue(error?.message || "Failed to fetch inactive companies");
        }
    }
);

export const activateCompanies = createAsyncThunk(
    "company/activateCompanies",
    async (userIds: number[], { rejectWithValue }) => {
        try {
            const response = await putAPI<any>("/admin/activate-companies", { userIds });
            return response;
        } catch (error: any) {
            return rejectWithValue(error?.message || "Failed to activate companies");
        }
    }
);
