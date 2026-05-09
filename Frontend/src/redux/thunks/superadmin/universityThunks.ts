import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAPI } from "@/apis/api";

export const fetchUniversities = createAsyncThunk(
  "superAdmin/fetchUniversities",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAPI<any>("/superadmin/universities");
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch universities");
    }
  }
);




