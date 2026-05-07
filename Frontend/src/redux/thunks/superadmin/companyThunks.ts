import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAPI, putAPI } from "@/apis/api";

export const fetchCompanies = createAsyncThunk(
  "superAdmin/fetchCompanies",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAPI<any>("/superadmin/companies");
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch companies");
    }
  }
);


export const updateCompanyStatus = createAsyncThunk(
  "superAdmin/updateCompanyStatus",
  async ({ ids, status }: { ids: number[], status: boolean }, { rejectWithValue }) => {
    try {
      const endpoint = status ? "/superadmin/companies/activate" : "/superadmin/companies/deactivate";
      const response = await putAPI<any>(endpoint, { ids });
      return { ids, status, response };
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update company status");
    }
  }
);

