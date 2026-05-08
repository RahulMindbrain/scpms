import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAPI, postAPI, putAPI } from "@/apis/api";

// FETCH REQUESTS
export const fetchCompanyRequests =
  createAsyncThunk(
    "company/fetchCompanyRequests",

    async (_, { rejectWithValue }) => {
      try {
        const response =
          await getAPI<any>(
            "/company/requests"
          );

        return response.data;
      } catch (error: any) {
        return rejectWithValue(
          error.message ||
            "Failed to fetch requests"
        );
      }
    }
  );

// SEND REQUEST
export const requestUniversity =
  createAsyncThunk(
    "company/requestUniversity",

    async (
      universityIds: number[],
      { rejectWithValue }
    ) => {
      try {
        const response =
          await postAPI<any>(
            "/company/request-university",
            {
              universityIds,
            }
          );

        return response.data;
      } catch (error: any) {
        return rejectWithValue(
          error.message ||
            "Failed to send request"
        );
      }
    }
  );

// REAPPLY REQUEST
export const reapplyUniversity =
  createAsyncThunk(
    "company/reapplyUniversity",

    async (
      universityIds: number[],
      { rejectWithValue }
    ) => {
      try {
        const response =
          await putAPI<any>(
            "/company/reapply-university",
            {
              universityIds,
            }
          );

        return response.data;
      } catch (error: any) {
        return rejectWithValue(
          error.message ||
            "Failed to reapply request"
        );
      }
    }
  );