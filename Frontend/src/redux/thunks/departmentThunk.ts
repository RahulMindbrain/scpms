import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAPI, postAPI } from "../../apis/api";

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

export const createDepartment = createAsyncThunk(
  "department/create",
  async (payload: { name: string; isActive?: boolean }, { rejectWithValue }) => {
    try {
      const response = await postAPI<any>("/dept/", payload);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to create department");
    }
  }
);
