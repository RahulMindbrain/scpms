import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAPI, postAPI } from "@/apis/api";

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


export const addUniversity = createAsyncThunk(
  "superAdmin/addUniversity",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await postAPI<any>("/superadmin/universities", data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to add university");
    }
  }
);

