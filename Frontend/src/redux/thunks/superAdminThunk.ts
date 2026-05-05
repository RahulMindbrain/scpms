import { createAsyncThunk } from "@reduxjs/toolkit";
import { 
  setLoading, 
  setSubmitting, 
  mockAddUniversity, 

  mockUpdateAdminStatus
} from "../slices/superAdminSlice";

// Mock delay to simulate network
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchUniversities = createAsyncThunk(
  "superAdmin/fetchUniversities",
  async (_, { dispatch }) => {
    dispatch(setLoading(true));
    await delay(500);
    dispatch(setLoading(false));
    return []; // Data is already in initial state for UI demo
  }
);

export const fetchAdmins = createAsyncThunk(
  "superAdmin/fetchAdmins",
  async (_, { dispatch }) => {
    dispatch(setLoading(true));
    await delay(500);
    dispatch(setLoading(false));
    return [];
  }
);



export const addUniversity = createAsyncThunk(
  "superAdmin/addUniversity",
  async (data: any, { dispatch }) => {
    dispatch(setSubmitting(true));
    await delay(800);
    dispatch(mockAddUniversity(data));
    dispatch(setSubmitting(false));
    return data;
  }
);



export const updateAdminStatus = createAsyncThunk(
  "superAdmin/updateAdminStatus",
  async ({ ids, status }: { ids: number[], status: boolean }, { dispatch }) => {
    dispatch(setSubmitting(true));
    await delay(800);
    dispatch(mockUpdateAdminStatus({ ids, status }));
    dispatch(setSubmitting(false));
    return { ids, status };
  }
);

export const updateCompanyStatus = createAsyncThunk(
  "superAdmin/updateCompanyStatus",
  async ({ ids, status }: { ids: number[], status: boolean }, { dispatch }) => {
    dispatch(setSubmitting(true));
    await delay(800);
    dispatch(mockUpdateCompanyStatus({ ids, status }));
    dispatch(setSubmitting(false));
    return { ids, status };
  }
);
