import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAPI } from "../../apis/api";

export const fetchDepartments = createAsyncThunk(
  "department/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAPI<any>("/dept/");
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch departments");
    }
  }
);
