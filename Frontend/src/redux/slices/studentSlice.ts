import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchStudents, fetchInactiveStudents, activateStudents, fetchStudentProfile, createStudentProfile, updateStudentProfile } from "../thunks/studentThunk";

interface StudentState {
  students: any[];
  inactiveStudents: any[];
  profile: any | null;
  loading: boolean;
  error: string | null;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null;
}

const initialState: StudentState = {
  students: [],
  inactiveStudents: [],
  profile: null,
  loading: false,
  error: null,
  meta: null,
};

const studentSlice = createSlice({
  name: "student",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Active Students
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.students = action.payload.data.data;
        state.meta = action.payload.data.meta;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Inactive Students
      .addCase(fetchInactiveStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInactiveStudents.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.inactiveStudents = action.payload.data.data;
        if (action.payload.data.meta) {
          state.meta = action.payload.data.meta;
        }
      })
      .addCase(fetchInactiveStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Activate Students
      .addCase(activateStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(activateStudents.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(activateStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Student Profile
      .addCase(fetchStudentProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentProfile.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.profile = action.payload.data;
      })
      .addCase(fetchStudentProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Student Profile
      .addCase(createStudentProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStudentProfile.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.profile = action.payload.data;
      })
      .addCase(createStudentProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Student Profile
      .addCase(updateStudentProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStudentProfile.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.profile = action.payload.data;
      })
      .addCase(updateStudentProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default studentSlice.reducer;
