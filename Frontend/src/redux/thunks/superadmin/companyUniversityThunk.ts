import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAPI, postAPI } from "@/apis/api";

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
              universityId:
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