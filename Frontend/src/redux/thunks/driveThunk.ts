import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAPI, putAPI } from "../../apis/api";

export const fetchJobs = createAsyncThunk(
    "drive/fetchJobs",
    async (params: { status?: string }, { rejectWithValue }) => {
        try {
            const response = await getAPI<any>("/admin/get-jobs", params);
            return response;
        } catch (error: any) {
            return rejectWithValue(error?.message || "Failed to fetch jobs");
        }
    }
);

export const updateJobStatus = createAsyncThunk(
    "drive/updateJobStatus",
    async (data: { jobIds: number[], status: string }, { rejectWithValue }) => {
        try {
            const response = await putAPI<any>("/admin/update-job-status", data);
            return response;
        } catch (error: any) {
            return rejectWithValue(error?.message || "Failed to update job status");
        }
    }
);
