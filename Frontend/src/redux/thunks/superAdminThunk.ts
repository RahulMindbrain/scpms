import { createAsyncThunk } from "@reduxjs/toolkit";
import { 
  setLoading, 
  setSubmitting, 
  mockAddUniversity, 
  mockAddProfession, 
  mockUpdateProfession, 
  mockDeleteProfession,
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

export const fetchProfessions = createAsyncThunk(
  "superAdmin/fetchProfessions",
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

export const createProfession = createAsyncThunk(
  "superAdmin/createProfession",
  async (data: any, { dispatch }) => {
    dispatch(setSubmitting(true));
    await delay(800);
    dispatch(mockAddProfession(data));
    dispatch(setSubmitting(false));
    return data;
  }
);

export const updateProfession = createAsyncThunk(
  "superAdmin/updateProfession",
  async ({ id, data }: { id: number, data: any }, { dispatch }) => {
    dispatch(setSubmitting(true));
    await delay(800);
    dispatch(mockUpdateProfession({ id, data }));
    dispatch(setSubmitting(false));
    return data;
  }
);

export const deleteProfession = createAsyncThunk(
  "superAdmin/deleteProfession",
  async (id: number, { dispatch }) => {
    dispatch(setSubmitting(true));
    await delay(800);
    dispatch(mockDeleteProfession(id));
    dispatch(setSubmitting(false));
    return id;
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
