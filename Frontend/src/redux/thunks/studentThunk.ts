import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAPI, putAPI } from "../../apis/api";

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

export const fetchInactiveStudents = createAsyncThunk(
    "student/fetchInactiveStudents",
    async (params: any, { rejectWithValue }) => {
        try {
            const response = await getAPI<any>("/admin/get-inactive-students", params);
            return response;
        } catch (error: any) {
            return rejectWithValue(error?.message || "Failed to fetch inactive students");
        }
    }
);

export const activateStudents = createAsyncThunk(
    "student/activateStudents",
    async (userIds: number[], { rejectWithValue }) => {
        try {
            const response = await putAPI<any>("/admin/activate-users", { userIds });
            return response;
        } catch (error: any) {
            return rejectWithValue(error?.message || "Failed to activate students");
        }
    }
);
