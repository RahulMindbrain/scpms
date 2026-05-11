import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAPI } from "@/apis/api";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const fetchUpcomingEvents = createAsyncThunk(
  "upcomingEvents/fetchAll",
  async (
    { page = 1, limit = 10 }: { page?: number; limit?: number } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await getAPI<ApiResponse<any>>(
        `/notification/upcoming-events?page=${page}&limit=${limit}`
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to fetch upcoming events"
      );
    }
  }
);