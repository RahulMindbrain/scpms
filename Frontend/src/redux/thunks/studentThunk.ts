import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAPI } from "../../apis/api";

export const fetchStudents = createAsyncThunk(
    "student/fetchStudents",
    async (params: any, { rejectWithValue }) => {
        try {
            const response = await getAPI<any>("/admin/get-students", params);
            return response;
        } catch (error: any) {
            return rejectWithValue(error?.message || "Failed to fetch students");
        }
    }
);
