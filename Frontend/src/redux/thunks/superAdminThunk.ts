import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAPI, postAPI, putAPI } from "@/apis/api";

export const fetchUniversities = createAsyncThunk(
  "superAdmin/fetchUniversities",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAPI<any>("/superadmin/universities");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch universities");
    }
  }
);

export const fetchAdmins = createAsyncThunk(
  "superAdmin/fetchAdmins",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAPI<any>("/superadmin/admins");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch administrators");
    }
  }
);

export const fetchCompanies = createAsyncThunk(
  "superAdmin/fetchCompanies",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAPI<any>("/superadmin/companies");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch companies");
    }
  }
);

export const addUniversity = createAsyncThunk(
  "superAdmin/addUniversity",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await postAPI<any>("/superadmin/universities", data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to add university");
    }
  }
);

export const registerAdmin = createAsyncThunk(
  "superAdmin/registerAdmin",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await postAPI<any>("/users/register", data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to register administrator");
    }
  }
);

export const updateAdminStatus = createAsyncThunk(
  "superAdmin/updateAdminStatus",
  async ({ ids, status }: { ids: number[], status: boolean }, { rejectWithValue }) => {
    try {
      const endpoint = status ? "/superadmin/admins/activate" : "/superadmin/admins/deactivate";
      const response = await putAPI<any>(endpoint, { ids });
      return { ids, status, data: response.data };
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update administrator status");
    }
  }
);

export const updateCompanyStatus = createAsyncThunk(
  "superAdmin/updateCompanyStatus",
  async ({ ids, status }: { ids: number[], status: boolean }, { rejectWithValue }) => {
    try {
      const endpoint = status ? "/superadmin/companies/activate" : "/superadmin/companies/deactivate";
      const response = await putAPI<any>(endpoint, { ids });
      return { ids, status, data: response.data };
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update company status");
    }
  }
);
