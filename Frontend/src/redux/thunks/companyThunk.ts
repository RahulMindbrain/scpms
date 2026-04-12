import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAPI } from "../../apis/api";

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
