import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAPI, putAPI, postAPI } from "../../apis/api";

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

export const fetchCompanyProfile = createAsyncThunk(
    "company/fetchCompanyProfile",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getAPI<any>("/company/profile");
            return response;
        } catch (error: any) {
            return rejectWithValue(error?.message || "Failed to fetch company profile");
        }
    }
);

export const createCompanyProfile = createAsyncThunk(
    "company/createCompanyProfile",
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await postAPI<any>("/company/profile", data);
            return response;
        } catch (error: any) {
            return rejectWithValue(error?.message || "Failed to create company profile");
        }
    }
);

export const updateCompanyProfile = createAsyncThunk(
    "company/updateCompanyProfile",
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await putAPI<any>("/company/profile", data);
            return response;
        } catch (error: any) {
            return rejectWithValue(error?.message || "Failed to update company profile");
        }
    }
);

export const postJob = createAsyncThunk(
    "company/postJob",
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await postAPI<any>("/company/post-job", data);
            return response;
        } catch (error: any) {
            return rejectWithValue(error?.message || "Failed to post job");
        }
    }
);

export const fetchCompanyJobs = createAsyncThunk(
    "company/fetchCompanyJobs",
    async (params: { page?: number; limit?: number }, { rejectWithValue }) => {
        try {
            const response = await getAPI<any>("/company/get-jobs", params);
            return response;
        } catch (error: any) {
            return rejectWithValue(error?.message || "Failed to fetch company jobs");
        }
    }
);

export const fetchJobApplications = createAsyncThunk(
    "company/fetchJobApplications",
    async (params: { status?: string; page?: number; }, { rejectWithValue }) => {
        try {
            const response = await getAPI<any>("/company/get-job-application", params);
            return response;
        } catch (error: any) {
            return rejectWithValue(error?.message || "Failed to fetch job applications");
        }
    }
);

export const updateJobApplicationStatus = createAsyncThunk(
    "company/updateJobApplicationStatus",
    async ({ id, status }: { id: number; status: string }, { rejectWithValue }) => {
        try {
            const response = await putAPI<any>(`/company/update-job-status/${id}`, { status });
            return response;
        } catch (error: any) {
            return rejectWithValue(error?.message || "Failed to update status");
        }
    }
);
