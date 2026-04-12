import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAPI, putAPI, postAPI } from "../../apis/api";

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

// Student Profile Thunks
export const fetchStudentProfile = createAsyncThunk(
    "student/fetchProfile",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getAPI<any>("/student/profile");
            return response;
        } catch (error: any) {
            return rejectWithValue(error?.message || "Failed to fetch student profile");
        }
    }
);

export const createStudentProfile = createAsyncThunk(
    "student/createProfile",
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await postAPI<any>("/student/profile", data);
            return response;
        } catch (error: any) {
            return rejectWithValue(error?.message || "Failed to create student profile");
        }
    }
);

export const updateStudentProfile = createAsyncThunk(
    "student/updateProfile",
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await putAPI<any>("/student/profile", data);
            return response;
        } catch (error: any) {
            return rejectWithValue(error?.message || "Failed to update student profile");
        }
    }
);
